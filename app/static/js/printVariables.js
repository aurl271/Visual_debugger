//ヘッダーのセット
function renderVariablesTableHeader(start_step,last_step) {
    const table_head = document.querySelector("#variables-table thead");
    //中身のリセット
    table_head.innerHTML = "";

    const row = document.createElement("tr");
    
    //変数名のヘッダー
    const variable_name = document.createElement("th");
    variable_name.textContent = "変数名";
    row.appendChild(variable_name);

    //ステップを表示
    for(let i = start_step; i < last_step; i++) {
        const value_name = document.createElement("th");
        value_name.textContent = `ステップ ${i + 1}`;
        row.appendChild(value_name);
    }

    table_head.appendChild(row);
}

//変数を表示するテーブルをセット
export default function renderVariablesTable(start_step,last_step,all_variables) {    
    //中身のリセット
    const table_body = document.querySelector("#variables-table tbody");
    table_body.innerHTML = "";

    //ヘッダーをセット
    renderVariablesTableHeader(start_step,last_step);

    //今がどのステップを扱っているかの表示
    const step_row = document.createElement("tr");
    const step_cell = document.createElement("td");
    step_cell.colSpan = (last_step - start_step) + 1;
    step_cell.textContent = `ステップ: ${start_step + 1}～${last_step}`;
    step_cell.style.fontWeight = "bold";
    step_row.appendChild(step_cell);
    table_body.appendChild(step_row);

    //扱うステップ内の変数名を取得
    const union_keys = Array.from(
        new Set(
            all_variables.slice(start_step, last_step).flatMap(dict => dict["variables"] ? Object.keys(dict["variables"]) : [])
        )
    );

    if(union_keys.length <= 0){
        document.getElementById("variables-div").style.display = "none";
        return;
    }else{
        document.getElementById("variables-div").style.display = "block";
    }

    //変数名ごとにループ
    for(let i=0; i < union_keys.length; i++) {
        const row = document.createElement("tr");

        //1列目は変数名
        const variable_name = document.createElement("td");
        variable_name.textContent = union_keys[i];
        row.appendChild(variable_name);

        //各ステップごとの値を追加(変数名がない場合は"N/A")
        for(let j=start_step; j < last_step; j++) {
            const value_cell = document.createElement("td");
            if (all_variables[j]?.["variables"]?.[union_keys[i]] != undefined) {
                value_cell.textContent = all_variables[j]["variables"][union_keys[i]];
            } else {
                value_cell.textContent = "N/A";
            }
            row.appendChild(value_cell);
        }

        //行を追加
        table_body.appendChild(row);
    }
}