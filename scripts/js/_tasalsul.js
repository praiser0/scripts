const _ClassId=JSON.parse(document.getElementById('ClassId').textContent);var __tasalsul=[]
function __setTasalsul(tasalsul){__tasalsul=buildTasalsul(tasalsul)}
const buildTasalsul=(items,ParentCOID=0)=>{const result=[];items.forEach(item=>{if(item.ParentCOID===ParentCOID){const children=buildTasalsul(items,item.ClassObjectID);result.push({...item,children})}});return result};function showAdds(ParentCOID){const addOptions=document.getElementById(`addOptions_${ParentCOID}`);addOptions.classList.toggle('hidden')}
function showAddField(ParentCOID){const addType=document.getElementById(`addType_${ParentCOID}`).value;const addField=document.getElementById(`addField_${ParentCOID}`);if(addType){addField.classList.remove('hidden')}else{addField.classList.add('hidden')}}
function findItem(items,id){for(const item of items){if(item.ClassObjectID==id)return item;const child=findItem(item.children,id);if(child)return child}
return null}
function addItem(ParentCOID){const input=document.getElementById(`itemNameNew_${ParentCOID}`);const name=input.value.trim();if(!name)return;const addType=document.getElementById(`addType_${ParentCOID}`).value;const newId=Date.now();const newItem={ProjectID:__tasalsul[0].ProjectID,EquipmentClassID:__tasalsul[0].EquipmentClassID,ClassObjectID:newId,ClassObjectName:name,ParentCOID:ParentCOID,children:[],ClassObjectType:addType};const parent=findItem(__tasalsul,ParentCOID);if(parent){parent.children.push(newItem)}
input.value='';document.getElementById(`addField_${ParentCOID}`).classList.add('hidden');document.getElementById(`addOptions_${ParentCOID}`).classList.add('hidden')}
function enableEditItem(ClassObjectID){const itemNameElement=document.getElementById(`itemName_${ClassObjectID}`);const itemEditElement=document.getElementById(`editItem_${ClassObjectID}`);itemNameElement.classList.toggle('hidden');itemEditElement.classList.toggle('hidden')}
function saveEditItem(id){const newName=document.getElementById(`editItemName_${id}`).value.trim();if(!newName)return;document.getElementById(`editItem_${id}`).classList.add('hidden');document.getElementById(`itemName_${id}`).innerText=newName}
function deleteItem(id){}
function _renderTasalsul(items,parentElement){parentElement.innerHTML='';items.forEach(item=>{const li=document.createElement('li');li.classList.add('list-group-item');li.innerHTML=`
            <span>
                <button class="btn btn-sm btn-link" onclick="toggleChildren(${item.ClassObjectID})">
                    <span id="icon-${item.ClassObjectID}" class="icon"><i class="fas fa-chevron-right"></i></span>
                </button>
                <span id="itemName_${item.ClassObjectID}" class="item-name">${item.ClassObjectName}</span>
                
                <div id="editItem_${item.ClassObjectID}" class="hidden">
                    <input type="text" id="editItemName_${item.ClassObjectID}" value="${item.ClassObjectName}">
                    <button onclick="saveEditItem('${item.ClassObjectID}')">Save</button>
                </div>
                
                <i class="fas fa-plus button-img" data-hover="Add" onclick="showAdds(${item.ClassObjectID})"></i>
                <i class="fas fa-edit button-img" data-hover="Edit" onclick="enableEditItem(${item.ClassObjectID})"></i>
                <i class="fas fa-trash button-img" data-hover="Delete" onclick="deleteItem(${item.ClassObjectID})"></i>
                
                <div id="addOptions_${item.ClassObjectID}" class="hidden">
                    <select id="addType_${item.ClassObjectID}" onchange="showAddField('${item.ClassObjectID}')">
                        <option value="">Select Option</option>
                        <option value="1">Folder</option>
                        <option value="2">Parameter</option>
                    </select>
                    <div id="addField_${item.ClassObjectID}" class="hidden">
                        <input type="text" id="itemNameNew_${item.ClassObjectID}" placeholder="New Item Name">
                        <button onclick="addItem('${item.ClassObjectID}')">Save</button>
                    </div>
                </div>
            </span>
            <ul id="children_${item.ClassObjectID}" class="list-group" style="display: none;"></ul>
        `;parentElement.appendChild(li);if(item.children&&item.children.length>0){_renderTasalsul(item.children,document.getElementById(`children_${item.ClassObjectID}`))}})}
function toggleChildren(ClassObjectID){const childrenContainer=document.getElementById(`children_${ClassObjectID}`);const icon=document.getElementById(`icon-${ClassObjectID}`);if(childrenContainer.style.display==='none'){childrenContainer.style.display='block';icon.innerHTML='<i class="fas fa-chevron-down"></i>'}else{childrenContainer.style.display='none';icon.innerHTML='<i class="fas fa-chevron-right"></i>'}}
document.addEventListener('DOMContentLoaded',async function(){try{const response=await fetch(`/api/ClassObject?_ClassId=${_ClassId}`);const tasalsul=await response.json();__setTasalsul(tasalsul)
_renderTasalsul(__tasalsul,document.getElementById('tasalsul'))}catch(error){console.error('Failed to fetch tasalsul data:',error)}})