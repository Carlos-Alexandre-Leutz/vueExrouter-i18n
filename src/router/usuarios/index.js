import { RouterView } from "vue-router";
const Usuario = () =>
    import ("@/views/usuarios/Usuarios.vue");
const NovaUsuario = () =>
    import ("@/views/usuarios/NovoUsuarios.vue");

const UsuarioViews = {
    path: "usuario",
    name: "Usuario",
    component: RouterView,
    children: [{
            path: "/usuario",
            name: "Usuario",
            component: Usuario,
        },
        {
            path: "editar/:usuarioId",
            name: "Editar cadastro de usuario",
            component: NovaUsuario,

        },
        {
            path: "Novo",
            name: "Novo cadastro de usuario",
            component: NovaUsuario,

        },
        {
            path: "visualizar/:usuarioId/:visualizar",
            name: "Visualizar cadastro de usuario",
            component: NovaUsuario,

        }
    ],
};

export default UsuarioViews;