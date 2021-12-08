import axios from "axios";
import qs from "qs";


const baseURL = window && window._env_ ? window._env_.REACT_APP_BACKEND_URL : "http://localhost:3001";

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

    async getTop5Vids(){
        return  [
            {
                id: "KfFRyml6Y2U",
                title: "Kevin de Vries - Planet X",
                description: "UNITED THROUGH MUSIC.",
                adaPrice: 150,
            },
            {
                id: "xLvMmC_ZKLk",
                title: "Gestapo Knallmuzik - Golden Drop [Öfficial Lyrik Video]",
                description: "Ein Zevermusic Produktzion.",
                adaPrice: 10000,
            },
            {
                id: "dQw4w9WgXcQ",
                title: "Rick Astley - Never Gonna Give You Up (Official Music Video)\n",
                description: "The official video",
                adaPrice: 2000,
            },
            {
                id: "eX2qFMC8cFo",
                title: "Funny cats",
                description: "Cats",
                adaPrice: 150,
            },
            {
                id: "cxEySPSUcXs",
                title: "Why is Belgium a country? - History of Belgium in 11 Minutes\n",
                description: "Belgium",
                adaPrice: 150,
            }
        ];
    }

    async getAllVids(){
        return  [
            {
                id: "KfFRyml6Y2U",
                title: "Kevin de Vries - Planet X",
                description: "UNITED THROUGH MUSIC.",
                adaPrice: 150,
            },
            {
                id: "xLvMmC_ZKLk",
                title: "Gestapo Knallmuzik - Golden Drop [Öfficial Lyrik Video]",
                description: "Ein Zevermusic Produktzion.",
                adaPrice: 10000,
            },
            {
                id: "dQw4w9WgXcQ",
                title: "Rick Astley - Never Gonna Give You Up (Official Music Video)\n",
                description: "The official video",
                adaPrice: 2000,
            },
            {
                id: "eX2qFMC8cFo",
                title: "Funny cats",
                description: "Cats",
                adaPrice: 150,
            },
            {
                id: "cxEySPSUcXs",
                title: "Why is Belgium a country? - History of Belgium in 11 Minutes\n",
                description: "Belgium",
                adaPrice: 150,
            }
        ];
    }
    async getMyVids(){
        return  [
            {
                id: "xLvMmC_ZKLk",
                title: "Gestapo Knallmuzik - Golden Drop [Öfficial Lyrik Video]",
                description: "Ein Zevermusic Produktzion.",
                adaPrice: 10000,
            }
        ];
    }
}