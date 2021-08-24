<template>
  <div class="d-flex flex-column col-11 m-auto">
    <div class="col-2">
      <router-link
        title="Adicionar novo usuário"
        class="ml-auto m-1 btn btn-sm btn-primary"
        to="/usuario/novo"
        >Adicionar</router-link
      >
    </div>
    <div class="card shadow">
      <div class="card-header">Usuário</div>
      <div class="card-body">
        <Suspense>
          <template #default>
            <Table
              class="table-borderless table-striped"
              :headerColumns="hColumns"
              :items="items"
              :componentePaginacao="componentePaginacao"
              pathPaginaAtual="cargo"
              action="true"
              @on-action-click="onEdit"
            >
              <template v-slot:table-header-actions>
                <div
                  class="
                    d-flex
                    flex-center
                    justify-content-center
                    align-items-center
                  "
                >
                  Ações
                </div>
              </template>
              <template v-slot:table-actions>
                <div
                  class="
                    d-flex
                    flex-center
                    justify-content-center
                    align-items-center
                  "
                >
                  <button
                    data-edit="2"
                    class="btn btn-sm btn-primary"
                    title="Visualizar"
                  >
                    <i data-edit="2" class="fas fa-eye"></i>
                  </button>
                  <button
                    title="Editar"
                    data-edit="1"
                    class="btn btn-sm btn-warning mr-2"
                  >
                    <i data-edit="1" class="fas fa-edit"></i>
                  </button>
                  <button
                    title="Excluir"
                    data-edit="0"
                    class="btn btn-sm btn-danger"
                  >
                    <i data-edit="0" class="fas fa-trash-alt"></i>
                  </button>
                </div>
              </template>
            </Table>
          </template>
          <template #fallback> caregando tabela </template>
        </Suspense>
      </div>
    </div>
  </div>
</template>
<script>
import Table from "../../components/Table/Table.vue";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import Swal from "sweetalert2";
export default {
  setup() {
    let router = useRouter();
    let items = ref(null);
    let itemSelected = ref(null);
    let componentePaginacao = ref(null);
    let hColumns = ref([
      {
        key: "nome",
        label: "Nome",
      },
    ]);

    const onEdit = (e) => {
      if (!e || !e.target || !e.target.dataset) {
        console.log("Objeto Errado");
        return;
      }
      if (e.target.dataset.edit == 1) {
        console.log("Editar", e.item.id);
        router.push("/usuario/editar/" + e.item.id);
      }
      if (e.target.dataset.edit == 2) {
        router.push("/usuario/visualizar/" + e.item.id + "/visualizar");
      }
      if (e.target.dataset.edit == 0) {
        itemSelected = e.item.id;
        let registroTarefa = false;
        let descricaoItemSelected = e.item.nome;
        Swal.fire({
          icon: "question",
          title: `Deseja excluir`,
          confirmButtonText: `Sim`,
          text: `O item "${descricaoItemSelected}"?`,
          showCancelButton: true,
          cancelButtonText: `Cancelar`,
        }).then((response) => {
          if (response.isConfirmed) {
            let itemExcluzao = itemSelected;
            let dataLocalStorageTarefa = localStorage.getItem(
              "dataLocalStorageTarefa"
            );
            if (dataLocalStorageTarefa) {
                           let tarefas = JSON.parse(dataLocalStorageTarefa);
              tarefas.forEach((tarefa) => {
                console.log(tarefa.atribuidaPara, itemExcluzao);
                if (tarefa.atribuidaPara == itemExcluzao) {
                  registroTarefa = true;
                }
              });
            }
            if (!registroTarefa) {
              let dataLocalStorageUsuarios = localStorage.getItem(
                "dataLocalStorageUsuario"
              );
              let usuarios = JSON.parse(dataLocalStorageUsuarios);

              usuarios.forEach((usuario) => {
                if (usuario.id == itemExcluzao) {
                  let indexGrid = usuarios.indexOf(usuario);
                  items.value.splice(indexGrid, 1);
                  let stringfy = JSON.stringify(items.value);
                  localStorage.setItem("dataLocalStorageUsuario", stringfy);
                }
              });
              Swal.fire({
                icon: "success",
                title: `Concluído`,
                text: `O Item "${descricaoItemSelected}" foi excluído`,
              });
              registroTarefa = false;
            } else {
              Swal.fire({
                icon: "warning",
                title: `Atenção`,
                text: `O usuário "${descricaoItemSelected}" não pode ser excluído pois ja possui tarefas cadastradas.`,
              });
            }
          }
        });
      }
    };

    onMounted(async () => {
      let dataLocalStorageUsuarios = localStorage.getItem(
        "dataLocalStorageUsuario"
      );
      let usuarios = JSON.parse(dataLocalStorageUsuarios);
      items.value = usuarios;
    });
    return {
      items,
      componentePaginacao,
      hColumns,
      onEdit,
    };
  },
  components: {
    Table,
  },
};
</script>
