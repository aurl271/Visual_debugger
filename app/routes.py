from flask import Flask, render_template, Blueprint, request, session, redirect, url_for
import json

app = Blueprint('app', __name__)

@app.route("/",methods=['GET','POST'])
def home():
    if request.method == 'GET':
        return render_template("home.html",code=None, all_variables=None,all_variables_json=None)
    
    elif request.method == 'POST':
        code = request.form['code-input']
        print("受け取ったコード:")
        print(code)
        variables = [{1:{"i":1,"j":2,"k":3}},{"i":4,"k":6},{"i":7,"j":8}]
        one_d_array = [{"i_array":[1,2,3],"j_array":[4,5,6,7],"k_array":[7,8,9,10,11]},
                       {"i_array":[12,13,14],"j_array":[15,16,17,18],"k_array":[19,20,21,22,23]}, 
                       {"i_array":[24,25,26],"j_array":[27,28,29,30],"k_array":[31,32,33,34,35]}]
        n_d_array = [{"2d_array":[[1,2],[3,4]],"3d_array":[[[1, 2], [3, 4]], [[5, 6], [7, 8]]]},
                     {"2d_array":[[5,6],[7,8]],"3d_array":[[[9,10],[11,12]],[[13,14],[15,16]]]}]
        all_variables = [
                {
                "variables":{
                        "i":1,
                        "j":2,
                        "k":3
                    },
                    "one_d_array":{
                        "i_array":[1,2,3],
                        "j_array":[4,5,6,7],
                        "k_array":[7,8,9,10,11]
                    },
                    "n_d_array":{
                        "2d_array":[[1,2],[3,4]],
                        "3d_array":[[[1, 2, 1], [3, 4, 3]], [[5, 6, 5], [7, 8, 7]]]
                    }
                },
                {
                    "variables":{
                        "i":4,
                        "k":6
                    },
                    "n_d_array":{
                        "3d_array":[[[9,10],[11,12]],[[13,14],[15,16]]],
                        "2d_array":[[5,6],[7,8]]
                    }
                },
                {
                    "variables":{
                        "i":7,
                        "j":8
                    },
                    "one_d_array":{
                        "i_array":[24,25,26],
                        "k_array":[31,32,33,34,35]
                    }
                },
                {
                    "one_d_array":{
                        "i_array":[1,2,3],
                        "j_array":[4,5,6,7],
                        "k_array":[7,8,9,10,11]
                    },
                    "n_d_array":{
                        "3d_array":[[[1, 2], [3, 4]], [[5, 6], [7, 8]]],
                        "2d_array":[[1,2],[3,4]]
                        
                    }
                }
            ]
        
        
        return render_template("home.html",code=code, all_variables=all_variables,all_variables_json=json.dumps(all_variables))