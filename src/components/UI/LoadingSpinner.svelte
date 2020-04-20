<style>
  .container {
    width: 100%;
    /* height: calc(100vh - 4rem); */
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .lds-dual-ring {
    display: inline-block;
    width: 80px;
    height: 80px;
  }
  .lds-dual-ring:after {
    content: " ";
    display: block;
    width: 64px;
    height: 64px;
    margin: 8px;
    border-radius: 50%;
    border: 6px solid #cf0056;
    border-color: #cf0056 transparent #cf0056 transparent;
    animation: lds-dual-ring 1.2s linear infinite;
  }
  @keyframes lds-dual-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>

<div class="container">
  <div class="lds-dual-ring" />
</div>
