function runBedTests() {


    // mock object
    if (igv === undefined) {
        igv = {};
    }

    igv.browser = {
        getFormat: function () {
        },

        genome: {
            getChromosome: function (chr) {
            },
            getChromosomeName: function (chr) {
                return chr
            }
        }
    };

    asyncTest("BED query", function () {

        var chr = "chr1",
            bpStart = 67655271,
            bpEnd = 67684468,
            featureSource = new igv.FeatureSource({
                format: 'bed',
                indexed: false,
                url: 'data/bed/basic_feature_3_columns.bed'
            });

        // Must get file header first
        featureSource.getFileHeader().then(function (header) {
            featureSource.getFeatures(chr, bpStart, bpEnd).then(function (features) {

                ok(features);
                equal(128, features.length);   // feature count. Determined by grepping file
                equal(chr, features[0].chr); // ensure features chromosome is specified chromosome

                start();
            }, undefined);
        }).catch(function (error) {
            console.log(error);
        });
    });

    asyncTest("BED track line", function () {

        var featureSource = new igv.FeatureSource({
            format: 'bed',
            indexed: false,
            url: 'data/bed/basic_feature_3_columns.bed'
        });

        featureSource.getFileHeader().then(function (header) {

            ok(header);
            equal(header.name, "Basic Features");
            equal(header.color, "255,0,0");
            start();
        });

    });

    asyncTest("BED query gzip", function () {

        var chr = "chr1",
            bpStart = 67655271,
            bpEnd = 67684468,
            featureSource = new igv.FeatureSource({
                format: 'bed',
                url: 'data/bed/basic_feature_3_columns.bed.gz'
            });

        featureSource.getFeatures(chr, bpStart, bpEnd).then(function (features) {

            ok(features);
            equal(128, features.length);   // feature count. Determined by grepping file
            equal(chr, features[0].chr); // ensure features chromosome is specified chromosome

            start();
        }, undefined);

    });

    asyncTest("broadPeak parsing ", function () {

        var featureSource,
            chr,
            bpStart,
            bpEnd;

        featureSource = new igv.FeatureSource({
            format: 'broadPeak',
            url: "data/peak/test.broadPeak"
        });

        chr = "chr22";
        bpStart = 16847690;
        bpEnd = 20009819;
        featureSource.getFeatures(chr, bpStart, bpEnd).then(function (features) {

            var feature;

            ok(features);
            equal(features.length, 100);   // # of features over this region

            feature = features[0];
            equal(chr, feature.chr);

            equal(feature.start, 16847690);
            ok(feature.end > bpStart);
            equal(feature.signal, 5.141275);

            start();

        }, undefined);

    });


}
