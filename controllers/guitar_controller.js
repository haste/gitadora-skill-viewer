var pg = require('pg');

module.exports.controller = function (app) {
  app.get('/:id/g', function (req, res) {
    //pg.defaults.ssl = true;
    pg.connect(process.env.DATABASE_URL, function (err, client, done) {
      var sql = 'select * from skill where id =' + req.params.id + ';';
      client.query(sql, function (err, result) {
        done();

        if (err) {
          console.error(sql);
          console.error(err);
          res.send(sql + "<br>" + err);
        } else {
          if (!result.rows[0]) {
            res.render("guitar");
          } else {
            var skill_data = JSON.parse(result.rows[0].guitar_skill);
            var skill_point = (parseFloat(skill_data.hot.point) + parseFloat(skill_data.other.point)).toFixed(2);
            res.render("guitar" , {
              player_name : result.rows[0].player_name.replace(/^"(.*)"$/, '$1'),
              id : req.params.id,
              skill_data : skill_data,
              skill_point : skill_point,
              skill_lv : parseInt(skill_point/500),
              update_date : result.rows[0].update_date
            });
          }
        }
      });
    });
  });
}
