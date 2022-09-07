import { customsearch_v1 } from "googleapis";

export async function search(query: string, page: number) {
    const customSearch = new customsearch_v1.Customsearch({
        auth: "AIzaSyAjOb4kpvgrQwrUCBCvonAX3UFZKrxO4jA",
    });

    return customSearch.cse.list({
        cx: "d23dee9d2ecbb41f5",
        q: query,
        num: 10,
        start: page * 10,
        searchType: "image",
        imgType: "photo",
    });
}
