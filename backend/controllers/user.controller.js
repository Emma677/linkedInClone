import User from "../model/user.model.js";

export const getSuggestedConnections = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id).select(
      "conneections"
    );

    const suggestedUser = await User.find({
      _id: {
        $ne: req.user.id,
        $nin: currentUser.connections,
      },
    }).select('name userName profileUrl headline').limit(3)

    res.json(suggestedUser)
  } catch (error) {
    console.log("error in getSuggestedConnections",error);
    res.status(500).json({message: "server error"})
  }
};


export const getPublicProfile = async (req,res)=>{
        const {userName} = req.params
    try {
        const user = await User.findOne({userName}).select("-password")
        if(!user){
            return res.status(404).json({message:'user not found'})
        }
        res.json(user)
    } catch (error) {
        console.error('error in publication controller:',error)
        return res.status(400).json({message:'server error'})
    }
}


export const updateProfile = async(req,res)=>{
    try {
        const allowFields = [
            "name",
            "headline",
            "about",
            "location",
            "profilePicture",
            "bannerImg",
            "skills",
            "experience",
            "education",
        ]

        const updatedData= {};

        for(const field of allowFields){
            if(req.body[field]){
                updatedData[field] = req.body[field]
            }
        }

        const user = await User.findByIdAndUpdate(req.user._id,{$set: updatedData}, {new:true}).select("-password");

        res.json(user)

    } catch (error) {
        console.error('error in updateProfile controller:',error)
        return res.status(400).json({message:'server error'})
    }
}