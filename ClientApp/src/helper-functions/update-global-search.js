export function updateGlobalSearch (value, productsList) {
    let filteredSearchList = [];
    if (value !== "") {
        let indexTerms = ["full_name", "email_address", "user_address", "user_city", "user_state"];
        for (var n = 0; n < indexTerms.length; n++) {
            let indexTerm = indexTerms[n];
            for (var i = 0; i < productsList.length; i++) {
                if (String(productsList[i][indexTerm]).toLowerCase().includes(value.toLowerCase())) {
                    filteredSearchList.push(productsList[i]);
                }
            }
        }
    } else {
        filteredSearchList = productsList;
    }
    return filteredSearchList;
};