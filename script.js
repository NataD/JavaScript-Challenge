const http = require('https');

http.get("https://www.monogo.pl/competition/input.txt").on('response', function (response) {
    let body = '',
        i = 0;
    response.on('data', function (chunk) {
        i++;
        body += chunk;
    });
    response.on('end', function () {
        const selectedFilters = JSON.parse(body).selectedFilters,
            products = JSON.parse(body).products,
            colors = JSON.parse(body).colors,
            sizes = JSON.parse(body).sizes,
            groupedValues = mergeArr([...products, ...colors, ...sizes]);

        let filteredColors = [],
            filteredSizes = [],
            filteredValues = [];

        Object.keys(selectedFilters).forEach(key => {
            if (key === 'colors') {
                filteredColors = selectedFilters[key].map(color => {
                    return groupedValues.filter(value => value.color === color);
                })
            }
        });

        Object.keys(selectedFilters).forEach(key => {
            if (key === 'sizes') {
                filteredSizes = selectedFilters[key].map(size => {
                    return [].concat(...filteredColors).filter(value => value.size === size);
                })
            }
        });


        filteredValues = [].concat(...filteredSizes).filter(value => value.price > 200);

        const min = Math.min(...filteredValues.map(item => item.price)),
            max = Math.max(...filteredValues.map(item => item.price)),
            multiply = Math.ceil(min * max);

        multiArr = String(multiply).split("").map((num)=>{
            return Number(num)
        });

        const multiSum = [];


        for (let i = 0; i < multiArr.length - 1; i+=2) {
            multiSum.push(multiArr[i] + multiArr[i+1]);
        }
        const result = multiSum.indexOf(14) * multiply * "Monogo".length;
        console.log('Wynik:', result);
    });
});

const mergeArr = (data) => {
    let merged = [];
    [data].forEach((el => a => a.forEach(b => {
        if (!el[b.id]) {
            el[b.id] = {};
            if (el[b.id].hasOwnProperty('value')) {
                typeof el[b.id].value === 'string' && el[b.id].value !== undefined ?
                    el[b.id].color = el[b.id].value : el[b.id].size = el[b.id].value;
            }

            merged.push(el[b.id]);
        }

        let obj = b;

        if (obj.hasOwnProperty('value') && obj.value !== null && obj.value !== undefined) {
            if (typeof obj.value === 'string') {
                let { value: color, ...rest } = obj;
                obj = { color, ...rest }
            } else {
                let { value: size, ...rest } = obj;
                obj = { size, ...rest }
            }
        }

        Object.assign(el[b.id], obj);
    }))(Object.create(null)));

    return merged;
};
