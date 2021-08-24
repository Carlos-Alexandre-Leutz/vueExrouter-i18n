<template>
  <div class="d-flex flex-column col-11 m-auto">
    <div class="col-2">
      <router-link title="Adicionar nova tarefa " class="ml-auto m-1 btn btn-sm btn-primary" to="/tarefa/novo"
        >Adicionar</router-link
      >
    
    </div>
    <div class="card shadow">
      <div class="card-header">Tarefas</div>
      <div class="card-body">
        <Suspense>
          <template #default>
            <Table
              class="table-borderless table-striped"
              :headerColumns="hColumns"
              :items="items"
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
        key: "value",
        label: "Tarefa",
      },
      {
        key: "lablAtribuidaPara",
        label: "Atribuida para",
      },
    ]);

    const onEdit = (e) => {
      if (!e || !e.target || !e.target.dataset) {
        console.log("Objeto Errado");
        return;
      }
      if (e.target.dataset.edit == 1) {
        console.log("Editar", e.item.id);
        router.push("/tarefa/editar/" + e.item.id);
      }
      if (e.target.dataset.edit == 2) {
        router.push("/tarefa/visualizar/" + e.item.id + "/visualizar");
      }
      if (e.target.dataset.edit == 0) {
        itemSelected = e.item.id;
        let descricaoItemSelected = e.item.lablAtribuidaPara;
        Swal.fire({
          icon: "question",
          title: `Deseja excluir`,
          confirmButtonText: `Sim`,
          text: `O item "${descricaoItemSelected}"?`,
          showCancelButton: true,
          cancelButtonText: `Cancelar`,
        }).then((response) => {
          if (response.isConfirmed) {
           
            let dataLocalStorageTarefa = localStorage.getItem(
              "dataLocalStorageTarefa"
            );
            let tarefas = JSON.parse(dataLocalStorageTarefa);
            let itemExcluzao = itemSelected;
            tarefas.forEach((tarefa) => {
              if (tarefa.id == itemExcluzao) {
                let indexGrid = tarefas.indexOf(tarefa);
                items.value.splice(indexGrid, 1);
                let stringfy = JSON.stringify(items.value);
                localStorage.setItem("dataLocalStorageTarefa", stringfy);
              }
            });
            Swal.fire({
               icon: "success",
              title: `Concluído`,
              text: `O Item "${descricaoItemSelected}" foi excluído`,
            });
          
          }
        });
      }
    };

    onMounted(async () => {
      let dataLocalStorageTarefa = localStorage.getItem(
        "dataLocalStorageTarefa"
      );
      let tarefas = JSON.parse(dataLocalStorageTarefa);
      items.value = tarefas;
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
