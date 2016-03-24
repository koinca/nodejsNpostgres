var appRouter = function(app, client) {
    //"http://localhost:3001/events"
    //json input->  params:
    app.get("/events", function(req, res) {
        var eventRows;

        var query = client.query("SELECT * from tablename");
        query.on("row", function (row, result) {
            result.addRow(row);
        });
        query.on("end", function (result) {
            eventRows = result.rows;
            console.log(result.rowCount + ' rows were received');
            //return res.send(JSON.stringify(eventRows));
            outputResult(res, result);
        });
    });

    function outputResult(res, result) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        res.send(result.rows);
    }

}

module.exports = appRouter;

