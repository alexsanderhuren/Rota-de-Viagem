import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const initialState = {
  origem: "",
  destino: "",
};

const AddEdit = () => {
  const [state, setState] = useState(initialState);
  const { origem, destino} = state;
  

  const history = useHistory();

  const { id } = useParams();

  useEffect(() => {
    if (id) {
      getSingleViagem(id);
    }
  }, [id]);

  const getSingleViagem = async (id) => {
    const response = await axios.get(`http://localhost:5000/viagem/${id}`);
    if (response.status === 200) {
      setState({ ...response.data[0] });
    }
  };

  const handleInputChange = (e) => {
    let { name, value } = e.target;
    setState({
      ...state,
      [name]: value,
    });
    
  };

  const addViagem = async (data) => {
    const response = await axios.post("http://localhost:5000/viagem", data);
    if (response.status === 200) {
      toast.success(response.data);
    } 
  };

  const updateViagem = async (data, id) => {
    const response = await axios.put(`http://localhost:5000/viagem/${id}`, data);
    if (response.status === 200) {
      toast.success(response.data);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!origem || !destino) {
      toast.error("Preencha todos os campos");
    } else {
      if (!id) {
        addViagem(state);
      } else {
        updateViagem(state, id);
      }

      setTimeout(() => history.push("/"),1000);
    }
  };
  return (
    <div style={{ marginTop: "100px" }}>
      <form
        style={{
          margin: "auto",
          padding: "15px",
          maxWidth: "400px",
          alignContent: "center",
        }}
        onSubmit={handleSubmit}
      >
        <h3>{id ? "Editar Viagem" : "Cadastrar Viagem"}</h3>
        <div class="col-md-12">
				  <div class="form-floating mb-3">
	  			  <input type="text" class="form-control" name= "origem" id="floatingInput"  value={origem} onChange={handleInputChange} placeholder="name@example.com" required/>
	  				<label for="floatingInput">Origem</label>
					</div>
				</div>

        <div class="col-md-12">
				  <div class="form-floating mb-3">
	  			  <input type="text" class="form-control" name= "destino" id="floatingInput"  value={destino} onChange={handleInputChange} placeholder="name@example.com" required/>
	  				<label for="floatingInput">Destino</label>
					</div>
				</div>
        <input class="btn btn-success btn-xs" type="submit" value={id ? "Atualizar" : "Cadastrar"} />
      </form>
    </div>
  );
};

export default AddEdit;
