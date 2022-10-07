const temp = (data)=>{
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="/detail.css">
  </head>
  <body>
    <div id="root">
      <header>
        <div class="logo">
        <a href="/">
          <img src="images/로고.png" alt="" class="img">
        </a>
        </div>
        <div class="login">
          <a href="">
            <button class="signUp">회원가입</button>
          </a>
          <a href="">
            <button class="signIn">로그인</button>
          </a>
        </div>
      </header>
      <main>
        <section id="img">
          <sidebar>
            <div id="left"></div>
          </sidebar>
          <div></div>
          <sidebar>
            <div id="right"></div>
          </sidebar>
        </section>
        <section id="txt">
          ${data}
        </section>
      </main>
      <footer>
        <div>
          <input type="text" placeholder="댓글 작성">
        </div>
      </footer>
    </div>
  </body>
  </html>`
}

module.exports = temp