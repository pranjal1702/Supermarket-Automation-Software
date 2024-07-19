const unitTransacationModel = require("../Models/UnitTransactionModel")

const getStatsForOneObject=async (req,res)=>{
    // to get total amount of sales in particular time period
    // and also total unit sold
    // console.log(req.query);
    console.log(req.query);
    try{
        const startDate = new Date(req.query.startDate);
        const endDate = new Date(req.query.endDate);
        endDate.setHours(23, 59, 59, 999);
        
        const allUnitTransactions=await unitTransacationModel.find(
            {
                $and:[{code:req.query.code},{dateAdded:{$gte:startDate,$lte:endDate}}]
            }
        );

        let totalUnitSold=0;
        let totalPriceSold=0;
        for(const item of allUnitTransactions){
            totalUnitSold=totalUnitSold+item.quantity;
            totalPriceSold=totalPriceSold+item.totalPrice;
        }

        return res.status(200).send({unitSold:totalUnitSold,value:totalPriceSold});

    }catch{
        return res.status(500).send({msg:"Internal server error"});
    }
}

const getTotalStats=async (req,res)=>{
    try{
        const startDate = new Date(req.query.startDate);
        const endDate = new Date(req.query.endDate);
        endDate.setHours(23, 59, 59, 999);
        
        const allUnitTransactions=await unitTransacationModel.find(
            {dateAdded:{$gte:startDate,$lte:endDate}}
        );

        let totalUnitSold=0;
        let totalPriceSold=0;
        for(const item of allUnitTransactions){
            totalUnitSold=totalUnitSold+item.quantity;
            totalPriceSold=totalPriceSold+item.totalPrice;
        }

        return res.status(200).send({totalUnitSold:totalUnitSold,totalValue:totalPriceSold});

    }catch{
        return res.status(500).send({msg:"Internal server error"});
    }
}

module.exports={getStatsForOneObject,getTotalStats}