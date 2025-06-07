//ヘッダーのセット
function renderQueueTableHeader(queue_names) {
    const table_head = document.querySelector("#queue-table thead");
    //中身のリセット
    table_head.innerHTML = "";

    const row_name = document.createElement("tr");
    for(let i=0; i < queue_names.length; i++) {
        //変数名のヘッダー
        const queue_name = document.createElement("th");
        queue_name.textContent = queue_names[i];
        queue_name.style.textAlign = "center";
        row_name.appendChild(queue_name);
    }
    table_head.appendChild(row_name);
}


//スタックの表示
export default function renderQueueTable(start_step,last_step,all_variables) {
    //変数名を取得
    const union_keys = Array.from(
        new Set(
            all_variables.slice(start_step, last_step).flatMap(dict => dict["deque"] ? Object.keys(dict["deque"]) : [])
        )
    );

    //テーブルを空に
    const table_body = document.querySelector("#queue-table tbody");
    table_body.innerHTML = "";

    //変数名がないなら表示を消してパス
    if(union_keys.length <= 0){
        document.getElementById("queue-div").style.display = "none";
        return;
    }else{
        document.getElementById("queue-div").style.display = "block";
    }

    //ヘッダーの設定
    renderQueueTableHeader(union_keys);

    let table_queue_contents = [],max_len = 0;
    for(let u=0; u < union_keys.length; u++) {
        //スタックの中身を取得
        let queue_content = [],len = 0;
        for(let i=start_step;i<last_step;i++){
            if(all_variables[i]?.["deque"]?.[union_keys[u]] == undefined){
                queue_content.push(-1);
            }else{
                queue_content.push(all_variables[i]["deque"][union_keys[u]]);
                len = Math.max(len,all_variables[i]["deque"][union_keys[u]].length);
            }
        }
        max_len = Math.max(max_len, len);

        //-1のところを"N/A"の2次元配列に
        for(let i=0;i<last_step-start_step;i++){
            if(queue_content[i] === -1){
                let tmp_queue = [];
                for(let j = 0;j<len;j++)tmp_queue.push("N/A");
                queue_content[i] = tmp_queue;
            }
        }

        //スタックの長さを調整
        for(let i=0;i<last_step-start_step;i++){
            if(queue_content[i].length !== len){
                for(let j=queue_content[i].length;j<len;j++){
                    queue_content[i].push("N/A");
                }
            }
        }

        //実際に表示するテーブル
        let table_queue = []
        for(let i = 0;i<len;i++){
            let tmp_str = String(queue_content[0][i]);
            for(let j = 1;j < last_step-start_step;j++){
                tmp_str = tmp_str + "->" + String(queue_content[j][i]);
            }
            table_queue.push(tmp_str);
        }
        table_queue_contents.push(table_queue);
    }

    //ヘッダーの設定
    const row_top = document.createElement("tr");
    for(let u=0; u < union_keys.length; u++) {
        const table_content = document.createElement("td");
        table_content.textContent = "Back";
        table_content.style.textAlign = "center";
        row_top.appendChild(table_content);
    }
    table_body.appendChild(row_top);

    //スタックの中身を表に追加
    for(let i=max_len-1; i >= 0; i--) {
        const row = document.createElement("tr");
        for(let u=0; u < union_keys.length; u++) {
            const table_content = document.createElement("td");
            if(i < table_queue_contents[u].length)table_content.textContent = table_queue_contents[u][i];
            else table_content.textContent = "";
            table_content.style.textAlign = "center";
            row.appendChild(table_content);
        }
        table_body.appendChild(row);
    }

    //ボトムの追加
    const row_bottom = document.createElement("tr");
    for(let u=0; u < union_keys.length; u++) {
        const table_content = document.createElement("td");
        table_content.textContent = "Front";
        table_content.style.textAlign = "center";
        row_bottom.appendChild(table_content);
    }
    table_body.appendChild(row_bottom);
}

/*
export default class printQueue{

    //今選択している変数名
    #_variable_name = "";
    //startstepを取得
    #_getStartStep;
    //laststepを取得
    #_getLastStep;
    //allvariablesを取得
    #_getAllVariables;

    //コンストラクタ
    constructor(getStartStep,getLastStep,getAllVariables){
        //startstepとかを取得できるように
        this.#_getStartStep = getStartStep;
        this.#_getLastStep = getLastStep;
        this.#_getAllVariables = getAllVariables;

        const queue_select = document.getElementById("queue-select");

        //変数選択できるように
        queue_select.addEventListener("change", (event) => {
            this.#changeVariableName(this.#_getStartStep(),this.#_getLastStep(),event.target.value,this.#_getAllVariables());
        });
    }

    //セレクト欄をリセット
    selectAllSet(start_step,last_step,all_variables){
        const queue_select = document.getElementById("queue-select");
        queue_select.innerText = "";

        //変数名を取得
        const union_keys = Array.from(
            new Set(
                all_variables.slice(start_step, last_step).flatMap(dict => dict["queue"] ? Object.keys(dict["queue"]) : [])
            )
        );
        
        if(union_keys.length <= 0){
            document.getElementById("queue-div").style.display = "none";
            return;
        }else{
            document.getElementById("queue-div").style.display = "block";
        }

        //変数名のオプションの追加
        for(let i=0; i < union_keys.length; i++) {
            const option = document.createElement("option");
            option.value = union_keys[i];
            option.textContent = `変数名:${union_keys[i]}`;
            queue_select.appendChild(option);
        }

        this.#_variable_name = union_keys[0];
    }

    //変数の指定
    #changeVariableName(start_step,last_step,new_variable_name,all_variables){
        this.#_variable_name = new_variable_name;
        console.log("new_variable_name",new_variable_name);
        this.renderQueueTable(start_step,last_step,all_variables,this.#_variable_name);
    }

    //の表示
    renderQueueTable(start_step,last_step,all_variables,variable_name = undefined) {
        variable_name ??= this.#_variable_name;

        //テーブルを空に
        const table_body = document.querySelector("#queue-table tbody");
        table_body.innerHTML = "";

        let is_exist = false;
        //該当する変数がないまたは横軸と縦軸が一致している場合はパス
        for(let i=start_step;i<last_step;i++){
            if(all_variables[i]?.["queue"]?.[variable_name] != undefined){
                is_exist = true;
                break;
            }
        }

        //変数がないなら表示を消してパス
        if(!is_exist){
            document.getElementById("queue-table").style.visibility = "none";
            return;
        }else{
            document.getElementById("queue-table").style.visibility = "visible";
        }

        //スタックの中身を取得
        let queue_contents = [],len = 0;
        for(let i=start_step;i<last_step;i++){
            if(all_variables[i]?.["queue"]?.[variable_name] == undefined){
                queue_contents.push(-1);
            }else{
                queue_contents.push(all_variables[i]["queue"][variable_name]);
                len = Math.max(len,all_variables[i]["queue"][variable_name].length);
            }
        }
        console.log("table_queue",queue_contents);

        //-1のところを"N/A"の2次元配列に
        for(let i=0;i<last_step-start_step;i++){
            if(queue_contents[i] === -1){
                let tmp_queue = [];
                for(let j = 0;j<len;j++)tmp_queue.push("N/A");
                queue_contents[i] = tmp_queue;
            }
        }

        //スタックの長さを調整
        for(let i=0;i<last_step-start_step;i++){
            if(queue_contents[i].length !== len){
                for(let j=queue_contents[i].length;j<len;j++){
                    queue_contents[i].push("N/A");
                }
            }
        }

        //実際に表示するテーブル
        let table_queue = []
        for(let i = 0;i<len;i++){
            let tmp_str = String(queue_contents[0][i]);
            for(let j = 1;j < last_step-start_step;j++){
                tmp_str = tmp_str + "->" + String(queue_contents[j][i]);
            }
            table_queue.push(tmp_str);
        }

        //ヘッダーの設定
        const row_head = document.createElement("tr");
        const table_head = document.createElement("th");
        table_head.textContent = "トップ";
        table_head.style.textAlign = "center";
        row_head.appendChild(table_head);
        table_body.appendChild(row_head);

        //スタックの中身を表に追加
        for(let i=len-1;i >= 0;i--){
            const row = document.createElement("tr");
            const table_content = document.createElement("td");
            table_content.textContent = table_queue[i];
            table_content.style.textAlign = "center";
            row.appendChild(table_content);
            //行を追加
            table_body.appendChild(row);
        }

        //ボトムの追加
        const row_bottom = document.createElement("tr");
        const table_bottom = document.createElement("th");
        table_bottom.textContent = "ボトム";
        table_bottom.style.textAlign = "center";
        row_bottom.appendChild(table_bottom);
        table_body.appendChild(row_bottom);
    }
}
*/