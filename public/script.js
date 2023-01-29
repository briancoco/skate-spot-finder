
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
const createSubmit = document.querySelector('#createBtn');
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
    const section = document.querySelector('.post-section');
    const token = localStorage.getItem('token');
    const error = document.createElement('div');
    if(!token) {
        error.textContent = 'Please login first.';
        section.appendChild(error);
        return;
    }
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
            console.log(posts);
            if(posts.length === 0) {
                error.textContent = 'No posts to display.';
                section.appendChild(error);
            }
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
    } catch (err) {
        error.textContent = 'Error! Please try again.'
        section.appendChild(error);
    }
    
}

const createPost = async (e) => {
    e.preventDefault();
    //creates a post using data from the form
    //calls /api/posts POST route using fetch api
    //then redirects user to posts page

    //first grab post data
    const name = document.querySelector('#nameField').value;
    const location = document.querySelector('#locationField').value;
    const image = document.querySelector('#imgField').files[0];
    let formData = new FormData();
    formData.append('image', image);
    const token = localStorage.getItem('token');
    try {
        let imagePath = await fetch('/api/posts/uploadImage', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`
            },
            body: formData
        })
        console.log(imagePath);
        if(imagePath.ok) {
            imagePath = await imagePath.json();
            imagePath = imagePath.image;

            const post = await fetch('/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({name, location, image: imagePath})
            });
            if(post.ok) {
                window.location.replace('/posts_page.html');
            }

        }
    } catch (error) {
        console.log(error);
    }
    
}

if(document.URL === 'http://localhost:3000/posts_page.html') {
    
    populatePosts();
}

if(createSubmit) createSubmit.addEventListener('click', createPost );