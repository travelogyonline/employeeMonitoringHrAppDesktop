function getDp(id, allUser) {
    if(!id || !allUser) {
        return null;
    }
    const dp = allUser.filter(item=>item._id===id)
    if(dp.length===0) return null;
    return dp[0].dp;
}

export default getDp;