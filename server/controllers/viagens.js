import nedb from "nedb";
const db = new nedb({filename: 'banco.db', autoload: true});
import distance from 'google-distance-matrix';
import collect from 'collect.js';

export const getViagens = (req, res) => {
  db.find({}).sort({ ordem: 1 }).exec(function (err, viagens) {
    res.send(viagens);
  })
};

export const createViagem = (req, res) => {
  var origins = [req.body.origem];
  var destinations = [req.body.destino];
  
  distance.key('AIzaSyArMUripom54C_xQ2qTpWvFWHJ_KZZBd2U');
  distance.units('metric');
  distance.language('pt');
  
  distance.matrix(origins, destinations, function (err, distances) {
      if (err) {
          return console.log(err);
      }
      if(!distances) {
          return console.log('no distances');
      }
      if (distances.status == 'OK') {
          for (var i=0; i < origins.length; i++) {
              for (var j = 0; j < destinations.length; j++) {
                  var origin = distances.origin_addresses[i];
                  var destination = distances.destination_addresses[j];
                  if (distances.rows[0].elements[j].status == 'OK') {
                      var distance = distances.rows[i].elements[j].distance.text;
                      var duration = distances.rows[i].elements[j].duration.text;
                      db.find({}).sort({ ordem: -1 }).limit(1).exec(function (err, ordem) {
                          if (ordem != ''){
                              var nOrdem = ordem[0].ordem + 1;
                          } else {
                              nOrdem = 1;
                          }
                          var viagem = {
                              ordem: nOrdem,
                              origem: req.body.origem,
                              destino: req.body.destino,
                              distancia: distance,
                              duracao: duration
                          };
                          db.insert(viagem, function(err){
                            res.send("Viagem Adicionada com Sucesso!");
                            
                          })
                      })
                  } else {
                      res.send("Não foi possível cadastrar a viagem, verifique origem e destino!");
                  }
              }
          }
      }
  })
};

export const getViagem = (req, res) => {
  db.find({_id: req.params.id}, function (err, viagem) {
    res.send(viagem);
  })

};

export const upViagem = (req, res) => {
  if (req.params.ordem > 1){
    db.update({ ordem: parseInt(req.params.ordem) - 1 }, { $set: { "ordem": parseInt(req.params.ordem)} }, {}, function () {    
        db.update({ _id: req.params.id }, { $set: { "ordem": parseInt(req.params.ordem) - 1} }, {}, function () {
            res.send('A ordem da viagem foi alterada!')
        })
    })
  } else {
    res.send('Não é possível alterar a ordem da viagem!')
  }  
};

export const downViagem = (req, res) => {
  db.find({}).sort({ ordem: -1 }).limit(1).exec(function (err, ordem) {
    if (req.params.ordem < ordem[0].ordem){
        db.update({ ordem: parseInt(req.params.ordem) + 1 }, { $set: { "ordem": parseInt(req.params.ordem)} }, {}, function () {    
            db.update({ _id: req.params.id }, { $set: { "ordem": parseInt(req.params.ordem) + 1} }, {}, function () {
                res.send('A ordem da viagem foi alterada!')
            })
        })
    } else {
        res.send('Não é possível alterar a ordem!')
    }
  })
};

export const deleteViagem = (req, res) => {
  db.find({}, function (err, viagens) {
    const data = collect(viagens);
    const total = data.count();
    for(var i=parseInt(req.params.ordem)+1; i<=parseInt(total); i++){
        var count = i;
        db.update({ ordem: i}, { $set: { "ordem": count-1 } }, {}, function () {
        })
    }
  })
  db.remove({ _id: req.params.id }, {}, function (err, numRemoved) {
    res.send('Viagem deletada com sucesso');
  })     
};

export const updateViagem = (req, res) => {
    var origins = [req.body.origem];
    var destinations = [req.body.destino];
    
    distance.key('AIzaSyArMUripom54C_xQ2qTpWvFWHJ_KZZBd2U');
    distance.units('metric');
    distance.language('pt');
    
    distance.matrix(origins, destinations, function (err, distances) {
        if (err) {
            return console.log(err);
        }
        if(!distances) {
            return console.log('no distances');
        }
        if (distances.status == 'OK') {
            for (var i=0; i < origins.length; i++) {
                for (var j = 0; j < destinations.length; j++) {
                    var origin = distances.origin_addresses[i];
                    var destination = distances.destination_addresses[j];
                    if (distances.rows[0].elements[j].status == 'OK') {
                        var distance = distances.rows[i].elements[j].distance.text;
                        var duration = distances.rows[i].elements[j].duration.text;
                          db.update({ _id: req.params.id }, { $set: { "origem": req.body.origem, "destino": req.body.destino, "distancia": distance, "duracao": duration} }, {}, function () {
                            res.send("Viagem atualizada com sucesso!");
                          })
                    } else {
                        res.send("Não foi possível cadastrar a viagem, verifique origem e destino!");
                    }
                }
            }
        }
    })
};
