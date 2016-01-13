function styleMap(map) {
    map.set('styles', [
        {
            featureType: 'all',
            elementType: 'geometry',
            stylers: [
                { color: '#DCD8CF' },
            ]
        }, {
            featureType: 'road',
            elementType: 'geometry',
            stylers: [
                { color: '#282827' },
            ]
        }, {
            featureType: 'road',
            elementType: 'labels',
    stylers: [
        { saturation: -100 },
        { invert_lightness: true }
    ]
        }, {
            featureType: 'transit',
            elementType: 'geometry',
            stylers: [
                { hue: '#fff700' },
                { lightness: -15 },
                { saturation: 99 }
            ]
        }, {
            featureType: 'water',
            stylers: [
                {color: '#d4cfc4'}
            ]
        }
    ]);
}
