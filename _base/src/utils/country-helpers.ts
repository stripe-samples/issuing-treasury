
import { faker } from "@faker-js/faker";
import { log } from "xstate";

export function getCountryVars(country: string) {
    let phoneRegEx;
    let postcode;
    let city;

    switch (country) {

        case 'AT': //Austria
            phoneRegEx = "+43(#)### ####";
            city = "Vienna";
            postcode = "1010"
            break;

        case 'AT': //Austria
            phoneRegEx = "+43(#)### ####";
            city = "Vienna";
            postcode = "1010"
            break;

        case 'BE': //Belgium
            phoneRegEx = "+32(#)## ## ## ##";
            city = "Brussels";
            postcode = "1000"
            break;

        // case 'Bulgaria':
        //     phoneRegEx = "+359(#)### ####";
        //     break;

        case 'HR': //Croatia
            phoneRegEx = "+385(#)## ### ###";
            city = "Zagreb";
            postcode = "10000"
            break;

        case 'CY': //Cyprus
            phoneRegEx = "+357(#)## ### ###";
            city = "Lefkosia";
            postcode = "1105"
            break;
        
        // case 'Czech Republic':
        //     phoneRegEx = "+420(#)### ### ###";
        //     break;

        // case 'Denmark':
        //     phoneRegEx = "+45(#)## ## ## ##";
        //     break;

        case 'EE': //Estonia
            phoneRegEx = "+372(#)#### ####";
            city = "Tallinn";
            postcode = "10101"
            break;

        case 'FI': //Finland
            phoneRegEx = "+358(#)## ### ####";
            city = "Helsinki";
            postcode = "00100"
            break;

        case 'FR': //France
            phoneRegEx = "+33(#)#########";
            city = "Paris";
            postcode = "75001"
            break;

        case 'DE': //Germany
            phoneRegEx = "+49(#)#########";
            city = "Berlin";
            postcode = "10176"
            break;

        case 'GB': //Great Britain
            phoneRegEx = "+44(#)#### #####";
            city = "London";
            postcode = "WC32 4AP";
            break;

        case 'GR': //Greece
            phoneRegEx = "+30(#)### #### ###";
            city = "Athens";
            postcode = "104 35";
            break;

        // case 'Hungary':
        //     phoneRegEx = "+36(#)## ### ###";
        //     break;

        case 'IE': //Ireland
            phoneRegEx = "+353(#)## ### ####";
            city = "Dublin";
            postcode = "D01 B2CD";
            break;

        case 'IT': //Italy
            phoneRegEx = "+39(#)#########";
            city = "Rome";
            postcode = "00042";
            break;

        case 'LV': //Latvia
            phoneRegEx = "+371(#)## ######";
            city = "Riga";
            postcode = "1000";
            break;

        case 'LT': //Lithuania
            phoneRegEx = "+370(#)## ######";
            city = "Vilnius";
            postcode = "01100";
            break;

        case 'LU': //Luxembourg
            phoneRegEx = "+352 (#)#### ####";
            city = "Luxembourg City";
            postcode = "1111";
            break;

        case 'MT': //Malta
            phoneRegEx = "+356(#)#### ####";
            city = "Valletta";
            postcode = "VLT 1061";
            break;

        case 'NL': //Netherlands
            phoneRegEx = "+31(#)## ########";
            city = "Amsterdam";
            postcode = "1008 DG";
            break;

        // case 'Poland':
        //     phoneRegEx = "+48(#)### ### ###";
        //     break;

        case 'PT': //Portugal
            phoneRegEx = "+351(#)### ### ###";
            city = "Lisbon";
            postcode = "1000";
            break;

        // case 'Romania':
        //     phoneRegEx = "+40(#)### ### ###";
        //     break;

        case 'SK': //Slovakia
            phoneRegEx = "+421(#)### ### ###";
            city = "Bratislava";
            postcode = "2412";
            break;

        case 'SI': //Slovenia
            phoneRegEx = "+386(#)## ### ###";
            city = "Ljubljana";
            postcode = "1000";
            break;

        case 'ES': //Spain
            phoneRegEx = "+34(6)## ## ## ##";
            city = "Barcelona";
            postcode = "08001";
            break;

        // case 'Sweden':
        //     phoneRegEx = "+46(#)## ### ## ##";
        //     break;
    };

    let countryVars = {
        phone:  "+" + phoneRegEx?.replace(/\W/g, '') + faker.string.numeric(phoneRegEx?.match(/#/g)?.length), //faker.phone.number(faker.helpers.fromRegExp(phoneRegEx)),
        city: city,
        postcode: postcode
    }
    
    return countryVars;
}
