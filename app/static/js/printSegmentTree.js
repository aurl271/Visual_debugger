export default class printSegmentTree{

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

        const segmenttree_select = document.getElementById("segmenttree-select");

        //変数選択できるように
        segmenttree_select.addEventListener("change", (event) => {
            this.#changeVariableName(this.#_getStartStep(),this.#_getLastStep(),event.target.value,this.#_getAllVariables());
        });
    }

    //セレクト欄をリセット
    selectAllSet(start_step,last_step,all_variables){
        const segmenttree_select = document.getElementById("segmenttree-select");
        segmenttree_select.innerText = "";

        const union_keys = Array.from(
            new Set(
                all_variables.slice(start_step, last_step).flatMap(dict => dict["segtree"] ? Object.keys(dict["segtree"]) : [])
            )
        );
        
        if(union_keys.length <= 0){
            document.getElementById("segmenttree-div").style.display = "none";
            return;
        }else{
            document.getElementById("segmenttree-div").style.display = "block";
        }

        //変数名のオプションの追加
        for(let i=0; i < union_keys.length; i++) {
            const option = document.createElement("option");
            option.value = union_keys[i];
            option.textContent = `変数名:${union_keys[i]}`;
            segmenttree_select.appendChild(option);
        }

        this.#_variable_name = union_keys[0];
    }

    //変数の指定
    #changeVariableName(start_step,last_step,new_variable_name,all_variables){
        this.#_variable_name = new_variable_name;
        console.log("new_variable_name",new_variable_name);
        this.renderSegmentTreeTable(start_step,last_step,all_variables,this.#_variable_name);
    }

    //ヘッダーの設定
    #renderSegmentTreeHeaderTable(len){
        const table_head = document.querySelector("#segmenttree-table thead");

        //中身を空に
        table_head.innerHTML = "";

        //一次元配列がないなら空のまま
        if(len === 0)return;

        const row = document.createElement("tr");
        
        //インデックスの追加
        for(let i = 0; i < len; i++) {
            const value_name = document.createElement("th");
            value_name.textContent = `idx${i}`;
            row.appendChild(value_name);
        }
        //行の追加
        table_head.appendChild(row);
    }

    //セグ木の表示
    renderSegmentTreeTable(start_step,last_step,all_variables,variable_name = undefined) {
        variable_name ??= this.#_variable_name;

        //テーブルを空に
        const table_body = document.querySelector("#segmenttree-table tbody");
        table_body.innerHTML = "";

        let is_exist = false;
        //該当する変数がないまたは横軸と縦軸が一致している場合はパス
        for(let i=start_step;i<last_step;i++){
            if(all_variables[i]?.["segtree"]?.[variable_name] != undefined){
                is_exist = true;
                break;
            }
        }

        console.log(variable_name,is_exist);

        if(!is_exist){
            this.#renderSegmentTreeHeaderTable(0);
            document.getElementById("segmenttree-table").style.visibility = "none";
            return;
        }else{
            document.getElementById("segmenttree-table").style.visibility = "visible";
        }

        let segtree_contents = [],len = 0;
        for(let i=start_step;i<last_step;i++){
            if(all_variables[i]?.["segtree"]?.[variable_name] == undefined){
                segtree_contents.push(-1);
            }else{
                segtree_contents.push(all_variables[i]["segtree"][variable_name]);
                len = all_variables[i]["segtree"][variable_name].length;
            }
        }

        //-1のところを"N/A"の2次元配列に
        for(let i=0;i<last_step-start_step;i++){
            if(segtree_contents[i] === -1){
                let tmp_segtree = [];
                for(let j = 0;j<len;j++)tmp_segtree.push("N/A");
                segtree_contents[i] = tmp_segtree;
            }
        }

        //ヘッダーの設定
        this.#renderSegmentTreeHeaderTable((len)/2);

        //実際に表示するテーブル
        let table_segtree = []
        for(let i = 0;i<len;i++){
            let tmp_str = String(segtree_contents[0][i]);
            for(let k = 1;k < last_step-start_step;k++){
                tmp_str = tmp_str + "->" + String(segtree_contents[k][i]);
            }
            table_segtree.push(tmp_str);
        }

        console.log(table_segtree);

        for(let i=0;i < Math.log2((len));i++){
            const row = document.createElement("tr");
            for(let j=0;j < 1<<i;j++){
                //最初はインデックスの追加
                const table_content = document.createElement("td");
                table_content.textContent = table_segtree[j+(1<<i)];
                table_content.colSpan = (len)>>(i+1);
                table_content.style.textAlign = "center";
                row.appendChild(table_content);
            }
            //行を追加
            table_body.appendChild(row);
        }
    }
}

