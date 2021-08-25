export function updateDynamicFilter (values, productsList) {
    let filteredSearchList = [];
    let valuesLength = values.length;
    for (var n = 0; n < valuesLength; n++) {
        let listToFilter = filteredSearchList;
        let indexTerm = Object.keys(values[n]);
        if (values[n][indexTerm] !== '') {
            let arrayLength = productsList.length;
            for (var i = 0; i < arrayLength; i++) {
                if (String(productsList[i][indexTerm]).toLowerCase().includes(values[n][indexTerm].toLowerCase()) && productsList[i][indexTerm] != undefined) {
                    listToFilter.push(productsList[i]);
                }
            }
        }
        filteredSearchList = listToFilter;
    }
    return filteredSearchList;
};