<template>
  <div v-if="this.$store.state.isAuth">
    <MDBBtn @click="
      () => {
        modalContent = '@getbootstrap';
        varyingExampleModal = true;
      }" tag="a" class="position-fixed" color="primary" href="#!" style="background-color: rgb(85, 172, 238); position:absolute; right:10%; top:30%">
    <font-awesome-icon icon="fa-solid fa-plus" /> Создать пост
  </MDBBtn>
  </div>
    <MDBRow class="mb-3 w-75 p-5">
    <MDBCol class="d-flex  p-5" col="6" md="4">
      <form class="position-fixed" action="" style="position:absolute; left:10%; top:30%">
        <div class="mb-2 " v-for="category in categories" :key="category.id">
                <input class="form-check-input float-start" type="checkbox" v-bind:value="category.id" v-model="categories1" v-bind:id="category.id">
                <label v-bind:for="category.id" class="form-check-label">{{ category.name }}</label><br>
        </div>
        <MDBBtn @click="forceRerender"  color="primary" block> Поиск </MDBBtn>
      </form>
    </MDBCol>
          <MDBCol md="8">
      <PostCard :ch-categories="categories1" type="all" :key="componentKey"></PostCard>
    </MDBCol>
  </MDBRow>
<!--Модальное окно-->
  <MDBModal
    id="varyingExampleModal"
    tabindex="-1"
    labelledby="varyingExampleModalLabel"
    v-model="varyingExampleModal"
  >
    <MDBModalHeader>
      <MDBModalTitle id="varyingExampleModalLabel"> Новый пост </MDBModalTitle>
    </MDBModalHeader>
    <MDBModalBody>
      <form>
        <div class="mb-3">
          <label for="title" class="col-form-label">Заголовок: </label>
          <input
            type="text"
            class="form-control"
            id="title"
            v-model="title"
          />
        </div>
        <div class="mb-3">
          <label for="message-text" class="col-form-label">Описание:</label>
          <textarea class="form-control" id="message-text" v-model="description"></textarea>
        </div>
        <div class="mb-3">
          <p class="col-form-label">Категория:</p>
          <div v-for="category in categories" :key="category.id">
              <input  v-model="ch_category" v-bind:value="category.id" class="form-check-input float-start m-1" type="radio" v-bind:id="'radio'+category.id">
              <label class="form-check-label float-start m-1" v-bind:for="'radio'+category.id">{{category.name}}</label>
          </div>
        </div>
        <div class="mb-3">
          <MDBFile
          v-model="files"
          multiple
          label="Выберите изображения:"
          v-on:change="handleFileUploads"
          />
        </div>
      </form>
      <div class="large-12 medium-12 small-12 cell">
  <div v-for="(file, key) in files" :key="key" class="file-listing">{{ file.name }} <span class="remove-file" v-on:click="removeFile( key )">{{key}}Remove</span></div>
</div>
<br>
    </MDBModalBody>
    <MDBModalFooter>

      <MDBBtn v-on:click="savePost" color="primary"> Сохранить пост </MDBBtn>
    </MDBModalFooter>
  </MDBModal>
</template>

<script>
  import { MDBCol, MDBRow, MDBBtn, MDBModal, MDBModalHeader, MDBModalTitle, MDBModalBody, MDBModalFooter,MDBFile} from "mdb-vue-ui-kit";
  import axios from "axios";
  import PostCard from "@/views/PostCard";
  import { ref } from 'vue'
  export default {
    name: "HomePage",
    data(){
      return{
        posts:[],
        like_posts:[],
        photos:[],
        categories:[],
        categories1:[],
        varyingExampleModal:false,
        files:'',
        title:'',
        description:'',
        ch_category:'',
        componentKey: 0,
      }
    },
    components: {
      MDBCol,
      MDBRow,
      MDBBtn,
      MDBModal,
      MDBModalHeader,
      MDBModalTitle,
      MDBModalBody,
      MDBModalFooter,
      MDBFile,
      PostCard,
    },
    mounted () {
      this.getCategories();

    },
      methods: {
      forceRerender() {
      this.componentKey += 1;
    },
              getCategories(){
            axios.get('/get-categories/').then(response => this.categories = response.data);
        },
        handleFileUploads(){
          this.files = this.$refs.files;
        },
        removeFile( key ){
          var a = []
          for( var i = 0; i < this.files.length; i++ ){
          let file = this.files[i];
          a[i]=file
          console.log(file)
        }
          a.splice( key, 1 );
          this.files=a
        },
        savePost(){
          var now = new Date();
                    axios
      .post('/posts/',{
        id_user:localStorage.getItem('user_id'),
        title:this.title,
        description:this.description,
        created_at:now,
        category_id:this.ch_category
  })
      .then(response=>{
        console.log(response)
        console.log(ref(["file"]).value)
        for( var i = 0; i < this.files.length; i++ ){
          let file = this.files[i];
          var formData = new FormData();
          formData.append("cover", file);
        formData.append("id_post", response.data.id);
        axios.post('/posts_photos/',formData,{headers:{
          'Content-Type': 'multipart/form-data'
        }})
      .then(response=>{
        console.log(response)

      })
      .catch(error =>{
        console.log(error)
      })
        }
      })
      .catch(error =>{
        console.log(error)
      })
        }
      }}
</script>

<style scoped lang="scss">

</style>