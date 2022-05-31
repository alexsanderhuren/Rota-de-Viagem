import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'

const Home = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    getViagens();
  }, []);

  const getViagens = async () => {
    const response = await axios.get("http://localhost:5000/viagens");
    if (response.status === 200) {
      setData(response.data);
    }
  };

  const onDeleteViagem = async (id, ordem) => {
    if (
      window.confirm("Você quer mesmo deletar essa viagem?")
    ) {
      const response = await axios.delete(`http://localhost:5000/viagem/${id}/${ordem}`);
      if (response.status === 200) {
        toast.success(response.data);
        getViagens();
      }
    }
  };

  const onUpViagem = async (id, ordem) => {
    
      const response = await axios.get(`http://localhost:5000/upviagem/${id}/${ordem}`);
      if (response.status === 200) {
        toast.info(response.data);
        getViagens();
      }
    
  };

  const onDownViagem = async (id, ordem) => {
    
    const response = await axios.get(`http://localhost:5000/downviagem/${id}/${ordem}`);
    if (response.status === 200) {
      toast.info(response.data);
      getViagens();
    }
  
};

  console.log("data=>", data);

  return (
    <div style={{ marginTop: "50px" }}>
      <div class = "container">
		    <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
			    <h1>Roteiro de Viagem MMTech</h1>
			  <div class="btn-group mr-2">
				  <a href="/add"class="btn btn-success"><i class="bi bi-plus-circle"></i> Cadastrar</a>
			  </div>
		    </div>
        <div class="table-responsive">
          <table id="example" class="table table-bordered table-hover">
            <thead>
              <tr>
                <th style={{ textAlign: "center" }}>Ordem</th>
                <th style={{ textAlign: "center" }}>Origem</th>
                <th style={{ textAlign: "center" }}>Destino</th>
                <th style={{ textAlign: "center" }}>Distância</th>
                <th style={{ textAlign: "center" }}>Tempo de Viagem</th>
                <th style={{ textAlign: "center" }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {data &&
                data.map((item) => {
                  return (
                    <tr>
                      <td>{item.ordem}</td>
                      <td>{item.origem}</td>
                      <td>{item.destino}</td>
                      <td>{item.distancia}</td>
                      <td>{item.duracao}</td>
                      <td>
                        <a href={`/update/${item._id}`} class="btn btn-sm btn-warning"><i class="bi bi-pen-fill"></i></a>&nbsp;
                        <a href="javascript:void(0)"  onClick={() => onDeleteViagem(item._id, item.ordem)} class="btn btn-sm btn-danger"><i class="bi bi-trash-fill"></i></a>&nbsp;
                        <a href="javascript:void(0)"  onClick={() => onUpViagem(item._id, item.ordem)} class="btn btn-sm btn-info"><i class="bi bi-arrow-up"></i></a>&nbsp;
                        <a href="javascript:void(0)"  onClick={() => onDownViagem(item._id, item.ordem)} class="btn btn-sm btn-dark"><i class="bi bi-arrow-down"></i></a>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Home;
