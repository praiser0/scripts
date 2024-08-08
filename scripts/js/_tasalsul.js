const _ClassId = JSON.parse(document.getElementById('ClassId').textContent);
var __tasalsul = []
function _setTasalsul(data){
    __tasalsul = buildTasalsul(data)
}
const buildTasalsul = (items, ParentCOID = 0) => {
    const result = [];
    items.forEach(item => {
        if (item.ParentCOID === ParentCOID) {
            const children = buildTasalsul(items, item.ClassObjectID);
            result.push({ ...item, children });
        }
    });
    return result;
};

function ItemOp(items, id) {
    for (const item of items) {
        if (item.ClassObjectID == id) return item;
        const child = findItem(item.children, id);
        if (child) return child;
    }
    return null;
}
function op(item, op, val){
    if(op === 'UPDATE'){
        item.ClassObjectName = val;
    }
}

function showAdds(ParentCOID) {
    const addOptions = document.getElementById(`addOptions_${ParentCOID}`);
    addOptions.classList.toggle('hidden');
}

function showAddField(ParentCOID) {
    const addType = document.getElementById(`addType_${ParentCOID}`).value;
    const addField = document.getElementById(`addField_${ParentCOID}`);
    if (addType) {
        addField.classList.remove('hidden');
    } else {
        addField.classList.add('hidden');
    }
}

function findItem(items, id) {
    for (const item of items) {
        if (item.ClassObjectID == id) return item;
        const child = findItem(item.children, id);
        if (child) return child;
    }
    return null;
}
function addItem(ParentCOID) {
    const input = document.getElementById(`itemNameNew_${ParentCOID}`);
    const name = input.value.trim();
    if (!name) return;

    const addType = document.getElementById(`addType_${ParentCOID}`).value;
    const newId = Date.now();
    const newItem = { ProjectID : __tasalsul[0].ProjectID,
                    EquipmentClassID : __tasalsul[0].EquipmentClassID,
                    ClassObjectID: newId,
                    ClassObjectName: name,
                    ParentCOID: ParentCOID, 
                    children: [], 
                    ClassObjectType: addType };

    const parent = findItem(__tasalsul, ParentCOID);
    if(parent)
    {parent.children.push(newItem);}

    input.value = '';
    document.getElementById(`addField_${ParentCOID}`).classList.add('hidden');
    document.getElementById(`addOptions_${ParentCOID}`).classList.add('hidden');

    _renderTasalsul();
}

function enableEditItem(ClassObjectID) {
    const itemNameElement = document.getElementById(`itemName_${ClassObjectID}`);
    const itemEditElement = document.getElementById(`editItem_${ClassObjectID}`);
    itemNameElement.classList.toggle('hidden');
    itemEditElement.classList.toggle('hidden');
}
function saveEditItem(id) {
    const newName = document.getElementById(`editItemName_${id}`).value.trim();
    if (!newName) return;

    document.getElementById(`editItem_${id}`).classList.add('hidden');
    item = ItemOp(__tasalsul, id)
    op(item, 'UPDATE', newName)
    console.log(__tasalsul)
    console.log(item)
    const li = document.getElementById(`item_${id}`)
    li.innerHTML = _renderNode(item)
}

function deleteItem(id) {
    function removeItem(items, id) {
        return items.filter(item => {
            if (item.ClassObjectID === Number(id)) {
                console.log('???')
                return false;
            }
            if (item.children && item.children.length > 0) {
                item.children = removeItem(item.children, id);
            }
            return true;
        });
    }

    __tasalsul = removeItem(__tasalsul, id);
    _renderTasalsul();
}

function _buildTasalsul(nodes, parentHTML){
    
    nodes.forEach(node => {
        li = _buildNode(node);
        parentHTML.appendChild(li);
        const ul = document.createElement('ul');
        ul.setAttribute('id', `children_${node.ClassObjectID}`);
        ul.classList.add('list-group');
        ul.style.display = 'none';
        if (node.children && node.children.length > 0) {
            li.appendChild(ul);
            _buildTasalsul(node.children, ul);
        }
    });
}
function _buildNode(node) {

    const li = document.createElement('li');
    li.setAttribute('id', `item_${node.ClassObjectID}`);
    li.classList.add('list-group-item');
    li.innerHTML = _renderNode(node)
    return li;
}
function _renderNode(node){
    innerHTML = `
        <span>
            <button class="btn btn-sm btn-link" onclick="toggleChildren(${node.ClassObjectID})">
                <span id="icon-${node.ClassObjectID}" class="icon"><i class="fas fa-chevron-right"></i></span>
            </button>
            <span id="itemName_${node.ClassObjectID}" class="item-name">${node.ClassObjectName}</span>
            
            <div id="editItem_${node.ClassObjectID}" class="hidden">
                <input type="text" id="editItemName_${node.ClassObjectID}" value="${node.ClassObjectName}">
                <button onclick="saveEditItem('${node.ClassObjectID}')">Save</button>
            </div>
            
            <i class="fas fa-plus button-img" data-hover="Add" onclick="showAdds(${node.ClassObjectID})"></i>
            <i class="fas fa-edit button-img" data-hover="Edit" onclick="enableEditItem(${node.ClassObjectID})"></i>
            <i class="fas fa-trash button-img" data-hover="Delete" onclick="deleteItem(${node.ClassObjectID})"></i>
            
            <div id="addOptions_${node.ClassObjectID}" class="hidden">
                <select id="addType_${node.ClassObjectID}" onchange="showAddField('${node.ClassObjectID}')">
                    <option value="">Select Option</option>
                    <option value="1">Folder</option>
                    <option value="2">Parameter</option>
                </select>
                <div id="addField_${node.ClassObjectID}" class="hidden">
                    <input type="text" id="itemNameNew_${node.ClassObjectID}" placeholder="New Item Name">
                    <button onclick="addItem('${node.ClassObjectID}')">Save</button>
                </div>
            </div>
        </span>
    `;
    return innerHTML;
}

function toggleChildren(ClassObjectID) {
    const childrenContainer = document.getElementById(`children_${ClassObjectID}`);
    const icon = document.getElementById(`icon-${ClassObjectID}`);
    if (childrenContainer.style.display === 'none') {
        childrenContainer.style.display = 'block';
        icon.innerHTML = '<i class="fas fa-chevron-down"></i>';
    } else {
        childrenContainer.style.display = 'none';
        icon.innerHTML = '<i class="fas fa-chevron-right"></i>';
    }
}

function reverseTasalsul(tasalsul__) {
    RT = [];
    function reverse(items) {
        items.forEach(item => { 
            if(item.children) {reverse(item.children)}
            //item.children = [];
            let newItem = Object.fromEntries(
                Object.entries(item).filter(([key, value]) => key !== 'children')
              );
            RT.unshift(newItem)
            return;
        })
    }
    reverse(tasalsul__)
    return RT
}

function commitChanges() {
    fetch('/commit-changes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({data : reverseTasalsul(__tasalsul)})
    })
    .then(response => response.json())
    .then(res => {
        if (res.status) {
            alert(res.message);
            window.location.reload();
        } else {
            alert(res.message);
        }
    })
    .catch(error => {
        console.error('Error committing changes:', error);
        alert('Error committing changes.');
    });
}

document.addEventListener('DOMContentLoaded', async function() {
    try {
        const response = await fetch(`/api/ClassObject?_ClassId=${_ClassId}`);
        const data = await response.json();

        _setTasalsul(data)
        _buildTasalsul(__tasalsul, document.getElementById('tasalsul'));

    } catch (error) {
        console.error('Failed to fetch tasalsul data:', error);
    }
});