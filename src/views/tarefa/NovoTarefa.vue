<template>
  <form @submit="validarForm">
    <div class="row mt-5">
      <div class="col-sm-11 m-auto">
        <div class="card shadow">
          <header class="card-header">
            <strong class="align-self-center"> Crie tarefas </strong>
          </header>
          <div class="card-body">
            <div class="row">
              <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12 mb-3">
                <div class="row">
                  <label> Campos com * são de preenchimento obrigatório </label>
                  <div class="col-sm-2 col-md-2 col-lg-2 col-xl-2">
                    <label>Referência </label>
                    <input
                      class="form-control"
                      type="numbers"
                      placeholder="Digite um valor"
                      v-model="ViewModel.value"
                      readonly
                    />
                  </div>

                  <div class="col-sm-10 col-md-10 col-lg-10 col-xl-10">
                    <label>* Atribuída para:</label>
                    <Multiselect
                      v-model="ViewModel.atribuidaPara"
                      placeholder="Selecione o usuário"
                      :options="optionsUsuarios"
                      :disabled="inputReadonly"
                    />
                  </div>

                  <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12">
                    <label>* Descrição </label>
                    <textarea
                      class="form-control"
                      v-model="ViewModel.descricao"
                      :readonly="inputReadonly"
                      maxlength="255"
                      placeholder="Digite a decrição"
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
                    @click="$router.push('/tarefa')"
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
import { ref, onMounted } from "vue";
import Multiselect from "@vueform/multiselect";
import { v4 as uuidv4 } from "uuid";
import Swal from "sweetalert2";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex";

export default {
  components: { Multiselect },
  setup() {
    const {
      params: { tarefaId, visualizar },
    } = useRoute();
    const store = useStore();
    const getId = () => {
      return tarefaId ? tarefaId : store.state.emptyGuid;
    };

    let mostrarBtnSalvar;
    let inputReadonly;
    let tarefaRef = 0;
    let router = useRouter();
    let optionsUsuarios = ref([]);
    if (visualizar) {
      mostrarBtnSalvar = false;
      inputReadonly = true;
    } else {
      mostrarBtnSalvar = true;
      inputReadonly = false;
    }
    if (!tarefaId) {
      let dataLocalStorageTarefa = localStorage.getItem(
        "dataLocalStorageTarefa"
      );
      if (dataLocalStorageTarefa) {
        let tarefas = JSON.parse(dataLocalStorageTarefa);
        tarefas.forEach((tarefa) => {
          if (tarefa.value >= tarefaRef) {
            tarefaRef = tarefa.value + 1;
          }
        });
      }
    }

    let ViewModel = ref({
      id: ref(getId),
      value: ref(tarefaRef),
      atribuidaPara: ref(),
      lablAtribuidaPara: ref(),
      descricao: ref(),
    });

    const limpaForm = () => {
      ViewModel.value.id = ref();
      ViewModel.value.value = ViewModel.value.value + 1;
      ViewModel.value.descricao = ref();
      ViewModel.value.atribuidaPara = ref();
    };

    const validarForm = (e) => {
      e.preventDefault();
      if (ViewModel.value.atribuidaPara) {
        salvaForm();
      } else {
        Swal.fire({
          icon: "warning",
          title: `Atenção`,
          text: `Campos com * são de preenchimento obrigatório`,
        });
      }
    };
    const salvaForm = () => {
      let dataLocalStorageTarefa = localStorage.getItem(
        "dataLocalStorageTarefa"
      );
      if (tarefaId) {
        let tarefas = JSON.parse(dataLocalStorageTarefa);
        tarefas.forEach((tarefa) => {
          if (tarefa.id == tarefaId) {
            console.log(tarefa);
            tarefa.id = ViewModel.value.id;
            tarefa.atribuidaPara = ViewModel.value.atribuidaPara;
            tarefa.descricao = ViewModel.value.descricao;
            let stringfy = JSON.stringify(tarefas);
            localStorage.setItem("dataLocalStorageTarefa", stringfy);
            status200Edt();
          }
        });
      } else {
        if (dataLocalStorageTarefa) {
          ViewModel.value.id = uuidv4();
          let localStorege = JSON.parse(dataLocalStorageTarefa);

          filtraLabelUsuario();
          localStorege.push(ViewModel.value);
          console.log(localStorege);

          let stringfy = JSON.stringify(localStorege);
          localStorage.setItem("dataLocalStorageTarefa", stringfy);
          status200();
        } else {
          ViewModel.value.id = uuidv4();
          let array = [];
          filtraLabelUsuario();
          array.push(ViewModel.value);
          let stringfy = JSON.stringify(array);
          localStorage.setItem("dataLocalStorageTarefa", [stringfy]);
          status200();
        }
      }
    };
    const status200 = () => {
      Swal.fire({
        icon: "success",
        title: `Concluído`,
        text: `A tarefa "${ViewModel.value.value}" foi adicionada`,
      });
      limpaForm();
    };
    const status200Edt = () => {
      Swal.fire({
        icon: "success",
        title: `Concluido`,
        text: `A tareda "${ViewModel.value.value}" foi editada`,
      });
    };
    const filtraLabelUsuario = () => {
      let dataLocalStorageUsuarios = localStorage.getItem(
        "dataLocalStorageUsuario"
      );
      if (dataLocalStorageUsuarios) {
        let localStorege = JSON.parse(dataLocalStorageUsuarios);
        localStorege.forEach((usuario) => {
          if (usuario.id == ViewModel.value.atribuidaPara) {
            ViewModel.value.lablAtribuidaPara = usuario.nome;
          }
        });
      }
    };

    onMounted(async () => {
      const obterSeletorUsuarios = () => {
        let dataLocalStorageUsuarios = localStorage.getItem(
          "dataLocalStorageUsuario"
        );
        if (dataLocalStorageUsuarios.length >= 1) {
          let localStorege = JSON.parse(dataLocalStorageUsuarios);
          localStorege.forEach((usuario) => {
            let Usuario = {
              value: usuario.id,
              label: usuario.nome,
            };
            optionsUsuarios.value.push(Usuario);
          });
        } else {
          Swal.fire({
            icon: "warning",
            title: `Atenção`,
            text: `Você ainda não possui nenhum usuario cadastrado!
            Deseja cadastras?`,
            showDenyButton: true,
            confirmButtonText: "Sim",
            denyButtonText: "Não",
          }).then((result) => {
            if (result.isConfirmed) {
              router.push("/usuario/novo");
            } else if (result.isDenied) {
              console.log("continuar cadastrando");
            }
          });
        }
      };
      obterSeletorUsuarios();
      const ObterTarefa = async (id) => {
        console.log("id", id);
        let dataLocalStorageUsuarios = localStorage.getItem(
          "dataLocalStorageTarefa"
        );
        if (dataLocalStorageUsuarios) {
          let usuarios = JSON.parse(dataLocalStorageUsuarios);
          usuarios.forEach((usuario) => {
            if (usuario.id == id) {
              ViewModel.value.id = usuario.id;
              ViewModel.value.atribuidaPara = usuario.atribuidaPara;
              ViewModel.value.descricao = usuario.descricao;
              ViewModel.value.value = usuario.value;
            }
          });
        }
      };
      try {
        if (tarefaId !== undefined) {
          ObterTarefa(tarefaId);
        }
      } catch (err) {
        console.error("Erro ao obter usuario para edição", err);
      }
    });
    return {
      ViewModel,
      optionsUsuarios,
      limpaForm,
      validarForm,
      filtraLabelUsuario,
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