import clientPromise from "../../db";
export const config = { api: { bodyParser: true, maxDuration: 5 } };
export default async function handler(req,res){
  try{
    const col=(await clientPromise).db("homegenius").collection("facts");
    if(req.method==="GET"){
      const {key,q,limit=20}=req.query;
      if(key){ const doc=await col.findOne({key}); return res.status(200).json({ok:true,doc}); }
      if(q){
        const l=Math.min(Number(limit)||20,100);
        const docs=await col.find({$text:{$search:q}}, {projection:{score:{$meta:"textScore"}}}).sort({score:{$meta:"textScore"}}).limit(l).toArray();
        return res.status(200).json({ok:true,docs});
      }
      return res.status(400).json({ok:false,error:"Provide ?key= or ?q="});
    }
    if(req.method==="POST"){
      const body=typeof req.body==="string"?JSON.parse(req.body):req.body;
      if(!body?.key) return res.status(400).json({ok:false,error:"Missing key"});
      await col.updateOne({key:body.key},{$set:{key:body.key,value:body.value??null,tags:body.tags??[],updated_at:new Date()}},{upsert:true});
      return res.status(200).json({ok:true});
    }
    return res.status(405).end();
  }catch(e){console.error("lookup error",e);return res.status(500).json({ok:false,error:e?.message||"unknown"});}
}
