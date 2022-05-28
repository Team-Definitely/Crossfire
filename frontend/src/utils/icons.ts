import { logos, logo_aliases } from '../constants'
export function getIconUrl(name: string, type: "Chain" | "Token" = "Chain"): string {
    if (!name) return ''
    if (name && Object.keys(logos).includes(name.toLowerCase())) {
        return logos[name.toLowerCase()]
    }

    if (name && Object.keys(logo_aliases).includes(name.toLowerCase())) {
        name = logo_aliases[name.toLowerCase()]
    }

    // if (name === 'WETH') name = 'ETH'
    // const BASE_URL =
    //     'https://raw.githubusercontent.com/spothq/cryptocurrency-icons/master/svg/icon/'
    const BASE_URL1 =
        'https://movricons.s3.ap-south-1.amazonaws.com/'
    const BASE_URL2 =
        `https://maticnetwork.github.io/polygon-token-assets/assets/`


    let BASE_URL = type === 'Chain' ? BASE_URL1 : BASE_URL2
    console.log("BASE URL", BASE_URL, type)

    const result = `${BASE_URL}${name}.svg`

    return result
}

export function onImageError(event: any) {
    event.target.src = '/ban.svg'
}
