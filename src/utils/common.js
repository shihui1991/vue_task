export function getChildGroup(list, parentId){
    let group = {children:[],others:[]};
    for(let row of list){
        row.children = [];
        if(row.parent_id == parentId){
            group.children.push(row);
        }else{
            group.others.push(row);
        }
    }
    return group;
}

export function makeTreeList(list,parentId){
    let tree = [];
    parentId = parentId ? parentId : 0;
    let group = getChildGroup(list,parentId);
    for(let row of group.children){
        row.children = makeTreeList(group.others,row.id);
        tree.push(row);
    }
    return tree;
}

export function timestampTodatetime(timestamp) {
    let date = timestamp ? new Date(timestamp * 1000) : new Date();
    let Y = date.getFullYear();
    let M = date.getMonth()+1;
    M = M < 10 ? '0' + M : M;
    let D = date.getDate();
    D = D < 10 ? '0' + D : D;
    let h = date.getHours();
    h = h < 10 ? '0' + h : h;
    let m = date.getMinutes();
    m = m < 10 ? '0' + m : m;
    let s = date.getSeconds();
    s = s < 10 ? '0' + s : s;
    return Y+ '-' +M+ '-' +D +' ' +h+ ':' +m+ ':' +s;
}

export function timestampTodate(timestamp) {
    let date = timestamp ? new Date(timestamp * 1000) : new Date();
    let Y = date.getFullYear();
    let M = date.getMonth()+1;
    M = M < 10 ? '0' + M : M;
    let D = date.getDate();
    D = D < 10 ? '0' + D : D;

    return Y+ '-' +M+ '-' +D;
}

export function inArray(search,array,sloppy){
    for(var i in array){
        if(sloppy && array[i] === search){
            return true;
        }
        if(!sloppy && array[i] == search){
            return true;
        }
    }

    return false;
}