import{
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory
} from "../services/categoryServices.js";

document.addEventListener("DOMContentLoaded", ()=>{
    const tableBody = document.querySelector("#categoriesTable tbody");
    const form = document.getElementById("categoryForm");
    const modal = new bootstrap.Modal(document.getElementById("categoryModal")); 
    const lblModal = document.getElementById("categoryModalLabel");
    const btnAdd = document.getElementById("btnAddCategory");

    init();

    btnAdd.addEventListener("click", ()=>{
        form.reset();
        form.categoryId.value = "";
        lblModal.textContent = "Agregar categoría";
        modal.show();
    });

    form.addEventListener("submit", async (e) => {
        e.preventDefault(); //Evitamos que el form se envie al hacer submit
        const id = form.categoryId.value;
        const data = {
            nombreCategoria: form.categoryName.value.trim(),
            descripcion: form.categoryDescription.value.trim()
        };

        try{
            //Si hay un ID. significa que estamos actualizando
            if(id){
                await updateCategory(id, data);
            }
            //Si no hay ID, significa que estamos agregando 
            else{
                await createCategory(data);
            }
            modal.hide(); //Se oculta el formulario despues de agregar o actualizar
            await loadCategories(); // Nos permite cargar las categorias
        }
        catch(err){
            console.error("Error: ", err);
        }

    });

    async function loadCategories(){
        try{
            const categories = await getCategories();

            tableBody.innerHTML = ""; //Vaciamos la tabla

            if(!categories || categories.length == 0){
                tableBody.innerHTML = '<td colspan="5">Actualmente no hay registros</td>';
                return;
            }   

            categories.forEach((cat)=>{
                const tr = document.createElement("tr");
                tr.innerHTML = `
                    <td>${cat.idCategoria}</td>
                    <td>${cat.nombreCategoria}</td>
                    <td>${cat.descripcion || ""}</td>
                    <td>${cat.fechaCreacion || ""}</td>
                    <td>
                        <button class= "btn btn-sm btn-outline-secondary edit-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                            class="lucide lucide-square-pen">
                            <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/>
                            </svg>
                        </button>

                        <button class="btn btn-sm btn-outline-danger delete-btn">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                            viewBox="0 0 24 24" fill="none" stroke="currentColor"
                            stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                            class="lucide lucide-trash">
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/>
                            <path d="M3 6h18"/>
                            <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                            </svg>
                        </button>
                    </td>    
                `;

                //Funcionalidad para botones de Editar
                tr.querySelector(".edit-btn").addEventListener("click", ()=>{
                    form.categoryId.value = cat.idCategoria;
                    form.categoryName.value = cat.nombreCategoria;
                    form.categoryDescription.value = cat.descripcion;
                    lblModal.textContent = "Editar Categoría";
                    
                    //El modal se carga hasta que el form ya tenga datos cargados
                    modal.show();
                });

                //Funcionalidad para botones de Eliminar
                tr.querySelector(".delete-btn").addEventListener("click", ()=> {
                    if(confirm("¿Desea eliminar esta categoría?")){
                        deleteCategory(cat.idCategoria).then(loadCategories);
                    }
                });

                tableBody.appendChild(tr); // Al TBODY se le concatena la nueva fila creada
            
            });
        }
        catch(err){
            console.error("Error cargando categorías: ", err);
        }
    }

    function init(){
        loadCategories();
    }

});