const API_URL="http://localhost:5226/api/Category";

export async function getCategory() {
    const response=await fetch(API_URL);

    if(!response.ok){
        throw new Error("Failed to fetch caterorys");
    }
    return await response.json();
}