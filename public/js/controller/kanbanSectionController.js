import {fetchTasks,createTask,deleteTask,updateTask} from"../model/kanbanSectionModel";

export function initSectionController({sectionID}){

    //SELECT
    fetchTasks(sectionID);

    //INSERT logic including panel manipulation
    const section=document.querySelector(`#${sectionID}-section`);
    const openPanelBtn=section.querySelector(".open-panel-btn");
    openPanelBtn.addEventListener("click",handleAddPanel);
    const addPanel=section.querySelector(".add-panel");
    function handleAddPanel(){
        if(addPanel.className.includes("hide")){
            addPanel.classList.remove("hide");
            addPanel.classList.add("show");
        }else if(addPanel.className.includes("show")){
            addPanel.classList.remove("show");
            addPanel.classList.add("hide");
        }
    }
    const textArea = section.querySelector("textArea");
    const addItemBtn = section.querySelector(".add-item-btn");
    textArea.addEventListener("input",({target:{value}})=>{
        if(value===""){
            addItemBtn.disabled=true;
        }else{
            addItemBtn.disabled=false;
        }
    });
    //INSERT: call POST API
    addItemBtn.addEventListener("click",()=>{
        const newTitle=textArea.value;
        createTask(sectionID,{title:newTitle,author:"justin"});
        textArea.value="";
        addItemBtn.disabled=true;
    });

    //UPDATE logic
    const taskList=section.querySelector(".item-list");
    const modal=section.querySelector(".modal");
    const modalOverlay=modal.querySelector(".modal-overlay");
    let updateTargetID="";
    //const modalContent=modal.querySelector(".modal-content");
    const modalTextArea=modal.querySelector(".title");
    const submitBtn=modal.querySelector(".submit");
    taskList.addEventListener("dblclick",({target})=>{
        const item=target.closest(".item");
        if(item===null) return; // 외곽의 리스트 자체를 클릭했을때 리턴
        const title = item.querySelector(".title").innerHTML;
        modal.classList.remove("modal-hide");
        modal.classList.add("modal-show");
        updateTargetID=item.attributes.dbid.value;
        modalTextArea.value=title;
    });
    modalOverlay.addEventListener("click",()=>{
        modal.classList.remove("modal-show");
        modal.classList.add("modal-hide");
    });
    modalTextArea.addEventListener("input",({target})=>{
        if(target.value===""){
            submitBtn.disabled=true;
        }else{
            submitBtn.disabled=false;
        }
    });
    //UPDATE: call PUT API
    submitBtn.addEventListener("click",()=>{
        updateTask(sectionID,{dbID:updateTargetID,title:modalTextArea.value});
    });

    //DELETE
    const taskListElement=section.querySelector(".item-list");
    taskListElement.addEventListener("click",onDeleteBtnClick);
    function onDeleteBtnClick(e){
        if(!e.target.className.includes("delete-btn")) return ;
        const result = window.confirm("정말 삭제하시겠습니까?");
        if(!result) return;
        const taskItem=e.target.closest(".item");
        const dbID=taskItem.attributes.dbID.value;
        deleteTask(sectionID,dbID);
    }

    //카드 옮기기 
    taskList.addEventListener("mousedown",(e)=>{
        const target=e.target;
        if(!target.className.includes("item"))return;
        const width=target.offsetWidth;
        const height=target.offsetHeight
        target.style.position='absolute';
        target.style.zIndex=1000;

        document.body.append(target);

        function moveAt(pageX,pageY){
            target.style.left=pageX- target.offsetWidth / 2+'px';
            target.style.top=pageY- target.offsetHeight / 2+'px';
        }

        moveAt(e.pageX,e.pageY);

        function onMouseMove(e){
            moveAt(e.pageX,e.pageY);
        }

        document.addEventListener('mousemove',onMouseMove);

        target.onmouseup=function(){
            document.removeEventListener('mousemove',onMouseMove);
            target.onmouseup=null;
        }

    });
    // taskList.addEventListener("mouseup",()=>{

    // })
}