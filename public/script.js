
//login functionality
//add an event listener to the submit btn
//the callback function of the event listener
//will use query selectors to get the info of the data fields
//then it'll call the register route of our api using fetch
//then it'll save the token inside localStorage for use later
//then it'll redirect to post page

//queryselect the login btn
const email = document.querySelector('#emailField');
const password = document.querySelector('#passwordField');
const registerSubmit = document.querySelector('#registerBtn');
const loginSubmit = document.querySelector('#loginBtn');
const register = async (e) => {
    e.preventDefault();
    //function handles login
    console.log(email.value, password.value);
    let token;
    try {
        token = await fetch('/api/auth/register', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email: email.value, password: password.value})
        })
        if(token.ok) {
            token = await token.json();
            localStorage.setItem('token', token);
            await populatePosts();
            window.location.replace('/');
        }

    } catch (error) {
        console.log(error.message);
    }

}

const login = async(e) => {
    e.preventDefault();
    //function handles login
    console.log(email.value, password.value);
    let token;
    try {
        token = await fetch('/api/auth/login', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email: email.value, password: password.value})
        })
        if(token.ok) {
            token = await token.json();
            localStorage.setItem('token', token.token);
            window.location.replace('/');
        }

    } catch (error) {
        console.log(error.message);
    }
}
if(registerSubmit) registerSubmit.addEventListener('click', register);
if(loginSubmit) loginSubmit.addEventListener('click', login);

//need function to get all the posts from the data base can then inject post elements into dom
const populatePosts = async () => {
    //gets posts from backend
    //iterate thru array of posts objs and inject dom
    const token = localStorage.getItem('token');
    try {
        let posts = await fetch('/api/posts', {
            method: 'get',
            headers: {
                authorization: `Bearer ${token}`
            }
        })
        if(posts.ok) {
            posts = await posts.json();
            posts = posts.posts;
            const section = document.querySelector('.post-section');
            console.log(posts);
            posts.map((post) => {
                const container = document.createElement('div');
                const image = document.createElement('img');
                const description = document.createElement('div');
                const header = document.createElement('h2'); 
                const location = document.createElement('h3');
                container.appendChild(image);
                container.appendChild(description);
                description
                    .appendChild(header)
                    .appendChild(location);
                    header.textContent = post.name;
                    location.textContent = post.location;
                container.classList.add('container');
                image.src = post.image;
                image.classList.add('post', 'cropped-ofp');
                description.classList.add('description');
                section.appendChild(container);
            })
        }
    } catch (error) {
        console.log(error.message);
    }
    
}

const createPost = () => {
    //creates a post using data from the form
    //calls /api/posts POST route using fetch api
    //then redirects user to posts page
    
}

if(document.URL === 'http://localhost:3000/posts_page.html') {
    
    populatePosts();
}