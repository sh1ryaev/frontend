<template>
 <MDBCard class="mb-5 p-1 mx-auto" v-for="item in posts" :key="item.id">
        <MDBCardText>
          <div style="position: absolute; left:1%; top:1%">
            <img class="float-start" v-bind:src="'http://127.0.0.1:8000'+item.user_photo" alt="..." style="width: 40px;height: 40px; border-radius: 50%;">
            <span>{{item.username}}</span>
          </div>
        <small style="font-size: 12px" class="text-muted ">Опубликовано {{item.created_at}}</small>
          <a href="" style="font-size: 12px" class=" p-1"> {{item.category}}</a>
      </MDBCardText>
      <div v-if="item.photos.length>1" v-bind:id="'slide'+item.id" class="carousel slide" data-bs-ride="carousel" >
          <div class="carousel-indicators">
    <button type="button" v-bind:data-bs-target="'#slide'+item.id" data-bs-slide-to="0" class="active" aria-current="true" aria-label="Slide 1"></button>
    <button v-for="n in item.photos.length-1" :key="'key'+n" type="button" v-bind:data-bs-target="'#slide'+item.id" v-bind:data-bs-slide-to="n" aria-label="Slide 2"></button>
  </div>
  <div class="carousel-inner">
    <div class="carousel-item active">
      <img v-bind:src="item.photos[0]" class="d-block w-100" alt="..." style="height: 300px; width: 300px; object-fit: cover;">
    </div>
    <div v-for="n in item.photos.length-1" :key="'slide'+n" class="carousel-item">
      <img v-bind:src="item.photos[n]" class="d-block w-100" alt="..." style="height: 300px; width: 300px; object-fit: cover;">
    </div>
  </div>
  <button class="carousel-control-prev" type="button"  v-bind:data-bs-target="'#slide'+item.id" data-bs-slide="prev">
    <span class="carousel-control-prev-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Предыдущий</span>
  </button>
  <button class="carousel-control-next" type="button" v-bind:data-bs-target="'#slide'+item.id"  data-bs-slide="next">
    <span class="carousel-control-next-icon" aria-hidden="true"></span>
    <span class="visually-hidden">Следующий</span>
  </button>
</div>
<div v-else>
  <img class="d-block w-100" v-bind:src="item.photos[0]" alt="..." style="height: 300px; width: 300px; object-fit: cover;">
</div>
    <MDBCardBody>
      <MDBCardTitle><strong>{{item.title}}</strong></MDBCardTitle>
      <MDBCardText class="overflow-auto" style="height: 5rem">{{item.description}}</MDBCardText>
      <transition name="bounce" mode="out-in">
          <div v-if="item.is_liked >0">
           <MDBBtn v-on:click.once=" delLikePost(item.id)" color="danger" rounded>
              <font-awesome-icon icon="fa-solid fa-heart" size="xl"/>
             <span style="font-size: 16px"><strong>{{" "+item.like_count}}</strong> </span>

          </MDBBtn>
      </div>
      <div v-else>
           <MDBBtn v-on:click.once="doLikePost(item.id)" color="" rounded >
             <font-awesome-icon icon="fa-solid fa-heart" size="xl"/>
             <span style="font-size: 16px"><strong>{{" "+item.like_count}}</strong> </span>
          </MDBBtn>
      </div>
      </transition>
    </MDBCardBody>
  </MDBCard>
</template>

<script>
import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBBtn} from "mdb-vue-ui-kit";
import axios from "axios";
export default {
  name: "PostCard",
      data(){
      return{
        posts:[],
        like_posts:[],
        photos:[],
        categories:[],
        categories1:[],
      }
    },
    components: {
      MDBCard,
      MDBCardBody,
      MDBCardTitle,
      MDBCardText,
      MDBBtn,
    },
  props: {
    type: String,
    chCategories: Array,
  },
  emits: ['update:ch_categories'],
  mounted () {
    if(this.type=='all')
    {
     this.categories1 = this.chCategories;
    }
      this.get_Photos();
    if(this.$store.state.isAuth)
    {
     this.get_Posts();
      this.getLikePosts();
    }
    else {
      this.get_AllPosts();
    }
      this.getCategories();

    },
  methods:{
            getLikePosts(){
          axios.get('/user-like/'+localStorage.getItem('user_id')+'/').then(response => {
            let ans = []
            for( var i = 0; i < response.data.length; i++ )
            {
              ans[i] = response.data[i].id_post
            }
            this.like_posts = ans
          });
        },
        getCategories(){
            axios.get('/get-categories/').then(response => this.categories = response.data);
        },
    get_AllPosts(){
              let str = this.categories1.join('%')
          axios.get('/posts?cat_id='+str).then(response => {
            let posts = response.data;
            let res = []
            var iter = 0
            for( var i = 0; i < posts.length; i++ )
            {
              let is_liked = 0
              const d = new Date(posts[i].created_at);
              var cat_name = ''
              if(posts[i].category_id===1)
              {
                cat_name = 'Программирование'
              }
              else {
                cat_name = 'Архитектура'
              }
              var photo = this.photos.filter(item=> item.id_post===posts[i].id)
              var photos = []
              for(var k = 0;k<photo.length;k++)
              {
                photos.push(photo[k].item)
              }
              let created_at = (d.getFullYear()+'-'+d.getMonth()+'-'+d.getDay()+' '+d.getHours()+':'+d.getSeconds())
               if(this.type==='mypost' && posts[i].id_user==localStorage.getItem('user_id'))
              {
                res[iter]={id:posts[i].id, id_user:posts[i].id_user, title:posts[i].title, description:posts[i].description,
              created_at:created_at, like_count:posts[i].like_count, is_liked:is_liked, category:cat_name, photos:photos}
                iter+=1
              }
              else if(this.type==='likedpost' && is_liked>0)
              {
               res[iter]={id:posts[i].id, id_user:posts[i].id_user, title:posts[i].title, description:posts[i].description,
              created_at:created_at, like_count:posts[i].like_count, is_liked:is_liked, category:cat_name, photos:photos}
                iter+=1
              }
              else if(this.type==='all'){
                res[i]={id:posts[i].id, id_user:posts[i].id_user, title:posts[i].title, description:posts[i].description,
              created_at:created_at, like_count:posts[i].like_count, is_liked:is_liked, category:cat_name, photos:photos}
               }
            }
                res.sort(function (a,b){return b.like_count-a.like_count})
                console.log(res)
                this.posts=res

          });
    },
        get_Posts() {
          let str = this.categories1.join('%')
          axios.get('/posts?cat_id='+str).then(response => {
            let posts = response.data;
              axios.get('/user-like/'+localStorage.getItem('user_id')+'/').then(response => {
            let ans = []
            let res = []
            for( var j = 0; j < response.data.length; j++ )
            {
              ans[j] = response.data[j].id_post
            }
            var iter = 0
            for( var i = 0; i < posts.length; i++ )
            {
              let is_liked = 0
              is_liked = ans.indexOf(posts[i].id)+1
              const d = new Date(posts[i].created_at);
              var cat_name = ''
              if(posts[i].category_id===1)
              {
                cat_name = 'Программирование'
              }
              else {
                cat_name = 'Архитектура'
              }
              var photo = this.photos.filter(item=> item.id_post===posts[i].id)
              var photos = []
              for(var k = 0;k<photo.length;k++)
              {
                photos.push(photo[k].item)
              }
              let created_at = (d.getFullYear()+'-'+d.getMonth()+'-'+d.getDay()+' '+d.getHours()+':'+d.getSeconds())
               if(this.type==='mypost' && posts[i].id_user==localStorage.getItem('user_id'))
              {
                res[iter]={id:posts[i].id, id_user:posts[i].id_user, title:posts[i].title, description:posts[i].description,
              created_at:created_at, like_count:posts[i].like_count, is_liked:is_liked, category:cat_name, photos:photos}
                iter+=1
              }
              else if(this.type==='likedpost' && is_liked>0)
              {
               res[iter]={id:posts[i].id, id_user:posts[i].id_user, title:posts[i].title, description:posts[i].description,
              created_at:created_at, like_count:posts[i].like_count, is_liked:is_liked, category:cat_name, photos:photos}
                iter+=1
              }
              else if(this.type==='all'){
                res[i]={id:posts[i].id, id_user:posts[i].id_user, title:posts[i].title, description:posts[i].description,
              created_at:created_at, like_count:posts[i].like_count, is_liked:is_liked, category:cat_name, photos:photos}
               }
            }
            this.like_posts = ans
                res.sort(function (a,b){return b.like_count-a.like_count})
                console.log(res)
                this.posts=res

          });
          });
        },
        get_Photos(){
          axios.get('/posts_photos/').then(response => {
            var photos = response.data
            var res = []
            for(var i=0;i<photos.length;i++)
            {
              var item = "http://127.0.0.1:8000"+photos[i].cover
              var pair = {id_post:photos[i].id_post, item:item}
              res.push(pair)
            }
            this.photos=res;
          });
        },
    doLikePost(id) {
          if(this.$store.state.isAuth)
          {

            axios.post('/user-like/',{id_user:localStorage.getItem('user_id'),id_post:id}).then(response=>{console.log(response);this.get_Posts()})
          }
      },
        delLikePost(id){
          if(this.$store.state.isAuth)
          {
            axios.post('/user-dellike/',{id_user:localStorage.getItem('user_id'),id_post:id}).then(response => {

            console.log(response)
            this.get_Posts()
          });
          }
        },
        get_Items(id) {
          var items = []
          var iter = 0
          axios.get('/posts_photos/')
              .then(response => {
                    var photos = response.data;
                    for (var i = 0; i < photos.length; i++) {
                      if (photos[i].id_post == id) {
                        items[iter] = "http://127.0.0.1:8000" + photos[i].cover
                        iter += 1
                      }
                    }
                    return items
                  }
              );
        }
  },

}

</script>

<style scoped>
.carousel-control-next-icon{
  background-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='black'><path d='M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z'/></svg>");
}
.carousel-control-prev-icon{
  background-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='black'><path d='M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z'/></svg>");
}
.bounce-enter-active {
  animation: bounce-in .4s;
}
.bounce-leave-active {
  animation: bounce-in .4s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
</style>