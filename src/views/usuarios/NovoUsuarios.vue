<template>
  <form @submit="validarForm">
    <div class="row mt-5">
      <div class="col-sm-11 m-auto">
        <div class="card shadow">
          <header class="card-header">
            <strong class="align-self-center"> Novo usuário </strong>
          </header>
          <div class="card-body">
            <div class="row">
              <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12 mb-3">
                <div class="row">
                  <label> Campos com * são de preenchimento obrigatório </label>

                  <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12">
                    <label>* Nome</label>
                    <input
                      class="form-control"
                      type="text"
                      v-model="ViewModel.nome"
                      required
                      :readonly="inputReadonly"
                      placeholder="Digite o nome"
                      maxlength="30"
                    />
                  </div>

                  <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12">
                    <label>* Descrição </label>
                    <textarea
                      class="form-control"
                      v-model="ViewModel.descricao"
                      required
                      maxlength="255"
                      :readonly="inputReadonly"
                      placeholder="Digite a descrição"
                    ></textarea>
                  </div>
                </div>

                <div class="d-flex mt-3 buttonsActions">
                  <button
                    v-if="mostrarBtnSalvar"
                    class="btn btn-success"
                    type="submit"
                  >
                    Salvar
                  </button>
                  <input
                    type="button"
                    v-if="mostrarBtnSalvar"
                    class="btn btn-warning ml-2 mr-2"
                    @click="limpaForm()"
                    value="Limpar"
                  />
                  <button
                    class="btn btn-secondary"
                    type="reset"
                    @click="$router.push('/usuario')"
                  >
                    Voltar
                  </button>
                </div>
              </div>
              <br /><br /><br />
            </div>
          </div>
        </div>
      </div>
    </div>
  </form>
</template>

<script>
import { ref } from "vue";
import { v4 as uuidv4 } from "uuid";
import Swal from "sweetalert2";
import { useRoute } from "vue-router";
import { useStore } from "vuex";

export default {
  components: {},
  setup() {
    const {
      params: { usuarioId, visualizar },
    } = useRoute();
    const store = useStore();
    const getId = () => {
      return usuarioId ? usuarioId : store.state.emptyGuid;
    };
    if (visualizar) {
      mostrarBtnSalvar = false;
      inputReadonly = true;
    } else {
      mostrarBtnSalvar = true;
      inputReadonly = false;
    }
    let mostrarBtnSalvar;
    let inputReadonly;
    let ViewModel = ref({
      id: ref(getId()),
      nome: ref(),
      descricao: ref(),
    });

    const limpaForm = () => {
      ViewModel.value.id = ref();
      ViewModel.value.descricao = ref();
      ViewModel.value.nome = ref();
    };

    const validarForm = (e) => {
      e.preventDefault();

      salvaForm();
    };

    const salvaForm = () => {
      let dataLocalStorageUsuarios = localStorage.getItem(
        "dataLocalStorageUsuario"
      );
      if (usuarioId) {
        let usuarios = JSON.parse(dataLocalStorageUsuarios);
        usuarios.forEach((usuario) => {
          if (usuario.id == usuarioId) {
            usuario.id = ViewModel.value.id;
            usuario.nome = ViewModel.value.nome;
            usuario.descricao = ViewModel.value.descricao;
            let stringfy = JSON.stringify(usuarios);
            localStorage.setItem("dataLocalStorageUsuario", stringfy);
            status200Edt();
          }
        });
      } else {
        if (dataLocalStorageUsuarios) {
          ViewModel.value.id = uuidv4();
          let localStorege = JSON.parse(dataLocalStorageUsuarios);
          localStorege.push(ViewModel.value);
          let stringfy = JSON.stringify(localStorege);
          localStorage.setItem("dataLocalStorageUsuario", stringfy);
          status200();
        } else {
          ViewModel.value.id = uuidv4();
          let array = [];
          array.push(ViewModel.value);
          let stringfy = JSON.stringify(array);
          localStorage.setItem("dataLocalStorageUsuario", [stringfy]);
          status200();
        }
      }
    };
    const status200 = () => {
      Swal.fire({
        icon: "success",
        title: `Concluído`,
        text: `O item "${ViewModel.value.nome}" foi adicionado `,
      });
      limpaForm();
    };
    const status200Edt = () => {
      Swal.fire({
        icon: "success",
        title: `Concluído`,
        text: `O item "${ViewModel.value.nome}" foi editado  `,
      });
    };
    const ObterUsuario = async (id) => {
      console.log("id", id);
      let dataLocalStorageUsuarios = localStorage.getItem(
        "dataLocalStorageUsuario"
      );
      if (dataLocalStorageUsuarios) {
        let usuarios = JSON.parse(dataLocalStorageUsuarios);
        usuarios.forEach((usuario) => {
          if (usuario.id == id) {
            ViewModel.value.id = usuario.id;
            ViewModel.value.nome = usuario.nome;
            ViewModel.value.descricao = usuario.descricao;
          }
        });
      }
    };
    try {
      if (usuarioId !== undefined) {
        ObterUsuario(usuarioId);
      }
    } catch (err) {
      console.error("Erro ao obter usuario para edição", err);
    }
    return {
      ViewModel,
      status200Edt,
      limpaForm,
      validarForm,
      mostrarBtnSalvar,
      inputReadonly,
    };
  },
};
</script>
<style src="@vueform/multiselect/themes/default.css"></style>
    
<style>
.buttonsActions {
  position: fixed;
  bottom: 10px;
}
</style>