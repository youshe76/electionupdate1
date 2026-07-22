export default function getPersonLink(value){
    value = parseInt(value)
    const placeHolderPhotoArray = [
    // "https://tse1.explicit.bing.net/th/id/OIP.UbXdry_H6pAzrO4qAF-WDAHaLH?r=0&pid=ImgDet&w=178&h=267&c=7&dpr=1.5&isAdult=true&o=7&rm=3",
    // "https://th.bing.com/th/id/OIP.iO1fk4v6DRgbwY5cLu9I8wAAAA?r=0&o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3",
    // "https://th.bing.com/th/id/R.8b9d129ee1185f67ffd46114dfcb8971?rik=qupmatkgrxIPJA&riu=http%3a%2f%2fwww.focushawaii.com%2fmodel-talent%2fstuartm%2fstuartm-02-16-07.jpg&ehk=j%2fNiqMaWG63v1034vlISJ5og3dLo3R2ueSF3eoWkRx4%3d&risl=&pid=ImgRaw&r=0",
    // "https://resizing.flixster.com/B1Kkan6fq5uf-NKeeSZeM7rbJMo=/218x280/v2/https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/83747_v9_aa.jpg",
    
    // "https://th.bing.com/th/id/OIP.NOxEXVXEfau6Fp1TRJ-NqgAAAA?w=115",
    "/election/candidates/2082/dhaneshwar-pandit_GItwb7UuiC.jpg",
    "/election/candidates/2082/kiran-maharjan_awvxbvmi5m.jpg",
    "/election/candidates/2082/jay-prakash-pant_mOmwuqflna.jpg",
    "/election/candidates/2082/aitan-kumar-mall_uqCwJhqg1D.jpg",
    "/election/candidates/2082/kishor-singh-rathor_nh0AVjj9B0.jpg",
    "/election/candidates/2082/rajesh-chand_oKWZIzx9nM.jpg",
    "/election/candidates/2082/parbat-gurung_6hLCGSmdoH.jpg",
    "/election/media/upload-new/gokarna-bista_tcrwg7la2G.jpg",
    "/election/candidates/2082/ajambar-rai-kangmang_YZjxBu5Oiv.jpg",
    "/election/candidates/2082/sanjiv-gurung_pYQ38idKIU.jpg"
    
    ]
    return placeHolderPhotoArray[value % placeHolderPhotoArray.length];
}