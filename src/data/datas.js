export const regions = [
"Toshkent shahar",
"Toshkent viloyati",
"Andijon viloyati",
"Farg'ona viloyati",
"Namangan viloyati",
"Xorazm viloyati",
"Samarqand viloyati",
"Buxoro viloyati",
"Navoiy viloyati",
"Sirdaryo viloyati",
"Jizzax viloyati",
"Qashqadaryo viloyati",
"Surxondaryo viloyati",
"Qoraqalpog'iston"
]

export const daysOfWeek = [
    "Dushanba",
    "Seshanba",
    "Chorshanba",
    "Payshanba",
    "Juma",
    "Shanba",
    "Yakshanba"
]


export function errorMessage(msg){
    return {
        status : 400,
        message : msg,
        success : false
    }
}