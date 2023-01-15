import axios from "axios";
import qs from "qs";


const baseURL = window && window._env_ ? window._env_.REACT_APP_BACKEND_URL : "http://localhost:8080";

export default class ApiService {
    constructor() {
        this.api = axios.create({
            baseURL,
            paramsSerializer: (params) => qs.stringify(params, { indices: false }),
            headers: {
                "Content-Type": "application/json",
            },
        });
    }

    // async get(url, config, shouldReverse = true) {
    //     try {
    //         const response = await this.api.get(url, config);
    //         return shouldReverse ? reverse(response.data) : response.data;
    //     } catch (error) {
    //         handleError(error);
    //     }
    // }

    async upload(unSignedTx, changeAddress){
        const {data: apiResponse} = await this.api.post("/api/upload",{
            unSignedTx,
            userChangeAddress: changeAddress,
            vidDetails: {}
        })
        return apiResponse.data;
    }

    async getTop5Vids(){
        return  [

        ];
    }

    async getAllVids(){
        return  [
            {
                id: "KfFRyml6Y2U",
                title: "Kevin de Vries - Planet X",
                description: "UNITED THROUGH MUSIC.",
                adaPrice: 150,
                views: 0,
                status: "Opened"
            }
        ];
    }
    async getOwnedVids(){
        return  [
            {
                id: "xLvMmC_ZKLk",
                title: "Gestapo Knallmuzik - Golden Drop [Öfficial Lyrik Video]",
                description: "Ein Zevermusic Produktzion.",
                adaPrice: 10000,
                views: 11400,
                status: "Closed"
            },
        ];
    }
    async getDemo(){
        const url = '/demo'
        const resp = await this.api.get(url)
        return resp.data.data
    }
}