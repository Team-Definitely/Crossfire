import ax from 'axios'

const axios = ax.create({
    baseURL: "https://api.socket.tech/v2/",
})

axios.defaults.headers.common["API-KEY"] =
    "645b2c8c-5825-4930-baf3-d9b997fcd88c";

export default axios
