const container = document.getElementById("drinks-display-container")

// Action: on load
const loadData = () => {
    fetch('https://www.thecocktaildb.com/api/json/v1/1/search.php?s=a')
    .then((res) => res.json())
    .then((data) => {
        // console.log(data)
        displayDrinks(data.drinks);
    })
    .catch((err) => {
        console.log(err);
    });
}

// Action: search button 
const handleSearch = () => {
    const inputValue = document.getElementById("search-box").value;
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${inputValue}`)
    .then((res) => res.json())
    .then((data) => {
        // console.log(data)
        displayDrinks(data.drinks);
    })
    .catch((err) => {
        console.log(err);
    });
}

// Action: details button 
const handleDetails = (id) => {
    fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`)
    .then((res) => res.json())
    .then((data) => {
        // console.log(data.drinks)
        displayDrinkDetail(data.drinks);
    })
    .catch((err) => {
        console.log(err);
    });
}

// Action: add to group button 
const handleAddToGroup = (data) => {
    console.log("group: ", data)
    const parent = document.getElementById("add-to-group");
    if(document.getElementById("count")) {
        console.log("say hi!!")
        const cartCount = document.getElementById("count").innerText;

        let convertedCount = parseInt(cartCount);
        convertedCount = convertedCount + 1;
        if(convertedCount>7)
        {
            window.alert("You've hit the 7 drinks limit!");
            return 0;
        }
        document.getElementById("count").innerText = convertedCount;
    }
    else {
        const count_div = document.createElement("div");
        count_div.id = "items-count-div"
        count_div.innerHTML = 
        `
            <h5> Total drinks selected: <span id="count">1</span> </h5>
            <hr>
        `
        parent.innerHTML="";
        parent.appendChild(count_div);
    }

    if(document.getElementById("grp-item"))
    {
        const tb = document.getElementById("grp-item");
        const tr = document.createElement("tr");
        tr.innerHTML=
        `
            <th scope="row">${parseInt(document.getElementById("count").innerText)}</th>
            <td><div class="avatar"><img src="${data.strDrinkThumb}" class="img-avatar" /></div></td>
            <td>${data.strDrink}</td>
        `
        tb.appendChild(tr);
    }
    else {
        const div = document.createElement("div");
        div.classList.add("added-list");
        div.innerHTML = `
                <div class="table-responsive">
                    <table class="table">
                        <thead class="table-light">
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Img</th>
                                <th scope="col">Name</th>
                            </tr>
                        </thead>
                        <tbody id="grp-item">
                            <tr>
                                <th scope="row">${parseInt(document.getElementById("count").innerText)}</th>
                                <td><div class="avatar"><img src="${data.strDrinkThumb}" class="img-avatar" /></div></td>
                                <td>${data.strDrink}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            `;
        parent.appendChild(div);
    }
};

// Display drink items
const displayDrinks = (items) => {
    container.innerHTML="";
    const div = document.createElement("div");
    div.id = "items-div"
    div.classList.add("row", "justify-content-center");
    // console.log(items)
    (items && items != "no data found") ? items.forEach((item, id) => {
        console.log(item)
        const divs = document.createElement("div");
        divs.classList.add("col", "custom-align");
        divs.innerHTML = 
            `
                <div class="card card-shadow mb-4" style="width:15rem;">
                    <img src="${item.strDrinkThumb}" class="card-img-top" alt="...">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title text-warning">${item.strDrink}</h5>
                        <h6 class="card-text">Category: <span class="text-warning">${item.strCategory}</span></h6>
                        <h6 class="card-text">Instructions: <span class="text-warning" id=${id}>${item.strInstructions}</span></h6>
                        <div class="d-flex flex-column flex-md-row justify-content-between">
                            <button class="btn btn-outline-success add-btn mb-2 mb-md-0" id="${item.idDrink}">Add to Group</button>
                            <button class="btn btn-outline-dark" onclick="handleDetails('${item.idDrink}')">Details</button>
                        </div>
                </div>
            `;
        
        div.appendChild(divs); 
        
    })
    :    
    div.innerHTML = `
        <div class="card card-shadow">
            <div class="card-body d-flex justify-content-center align-items-center">
                <h5> No items found! </h5>
            </div>
        </div>
    `
    ;
    container.appendChild(div);

    // Action: Add to group event listener and text truncate
    if(items && items != "no data found") {
        items.forEach((item, id) => {
            const instruction = document.getElementById(id);
            instruction.innerText = instruction.innerText.slice(0, 15) + "...";
            const add = document.getElementById(item.idDrink);
            add.addEventListener("click", () => {
                const val = handleAddToGroup(item);
                if(val!=0) {
                    add.disabled = true;
                    add.innerText = "Added";
                    add.style.color = "rgba(157, 157, 157, 1)"
                    add.style.borderColor = "rgba(157, 157, 157, 1)"
                }
            });
        });
    }

}

// Drink details popover
const displayDrinkDetail = (data) => {    
    const modal = document.getElementById("modal-div");
    const modal_content = document.getElementById("custom-modal-content");
    const measureList = measures(data[0]);
    const ingredientList = ingredients(data[0]);

    modal_content.innerHTML=
    `
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">${data[0].strDrink}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <div class="card">
                    <img src="${data[0].strDrinkThumb}" class="card-img" style="height:250px;" alt="...">
                    <div class="card-body">
                        <h6 class="mb-3">Category: <span class="text-warning text-bg-dark p-1 rounded">${data[0].strCategory}</span></h6>
                        <h6>Alcoholic: <span class="text-white p-1 rounded ${data[0].strAlcoholic=="Alcoholic" ? "text-bg-danger":"text-bg-success"}">${data[0].strAlcoholic}</span></h6>
                        <hr>
                        <h5>Ingrdients: </h5>
                            <ol class="list-group list-group-numbered">
                                ${ingredientList.map((item, id) => `
                                <li class="list-group-item d-flex justify-content-between align-items-start">
                                    <div class="ms-2 me-auto">
                                    <div class="fw-bold">${item}</div>
                                    ${measureList[id]}
                                    </div>
                                </li>`).join("")}
                            </ol>
                        <hr>
                        <h5>Instructions: </h5>
                        <p>${data[0].strInstructions}</p>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
        </div>
    `
    let modal_div = new bootstrap.Modal(modal);
    modal_div.show();
}

// retrieval of ingredients for a drink 
const ingredients = (data) => {
    let ingredientList = [];
    let i=1;
    while(i<16) {
        let compKey = "strIngredient"+i;
        if(data[compKey] && data[compKey]!="")
        {
            ingredientList.push(data[compKey]);
        }
        i = i+1;
    }
    return ingredientList;
}

// retrieval of corresponding ingredient measures for the drink
const measures = (data) => {
    let measurementList = [];
    let i=1;
    while(i<21) {
        let compKey = "strMeasure"+i;
        if(data[compKey] && data[compKey]!="")
        {
            measurementList.push(data[compKey])
        }
        i++;
    }
    return measurementList;
}