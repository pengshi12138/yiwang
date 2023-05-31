class Masonry {
  constructor(container, options = {}) {
    const {
      ROOT_URL = '',        // 基本url
      viewer = {},         // 存储图片地址
      PIC_LOADING_NUM = 0, // 图片加载个数
      COLUMN_WIDTH = 500,   // 元素宽度
      GAP_WIDTH = 15,       // 元素水平间距
      GAP_HEIGHT = 15,      // 元素垂直间距
      WINDOW_WIDTH = 500,   // 浏览器窗口大小
    } = options

    this.COLUMN_WIDTH = COLUMN_WIDTH
    this.GAP_WIDTH = GAP_WIDTH
    this.GAP_HEIGHT = GAP_HEIGHT
    if (document.body.offsetWidth <= 500) {
      this.COLUMN_WIDTH = document.body.offsetWidth - 2 * this.GAP_WIDTH
      this.WINDOW_WIDTH = document.body.offsetWidth
      $(".cell").css({"width": this.COLUMN_WIDTH + "px"})
    }
    this.container = container
    this.columnCount = 0  // 列数
    this.columnHeights = [] // 每列的高度组成的数组
  }

  init(viewer, baseUrl) { 
    this.ROOT_URL = baseUrl
    this.viewer = viewer
    this.resetColumnCount()
    this.resetHeights()
    this.manageCells()
    this.bindEvent()
  }
  

  /* 计算列数 */
  resetColumnCount() {
    this.columnCount = Math.max(1, Math.floor((document.body.offsetWidth + this.GAP_WIDTH) / (this.COLUMN_WIDTH + this.GAP_WIDTH)))
  }

  /* 重置高度数组 */
  resetHeights() {
    this.columnHeights = new Array(this.columnCount).fill(0)
    this.container.style.width = this.columnCount * (this.COLUMN_WIDTH + this.GAP_WIDTH) - this.GAP_WIDTH + 'px'
  }
  
  /* 滚动到底部，加载更多 */
  manageCells() {
    this.loadMoreCells()
  }

 

  bindEvent() {
    // 重新判断形状
    let resizeDelay = null
    window.onresize = () => {
      clearTimeout(resizeDelay)
      resizeDelay = setTimeout(() => this.reflowCells(), 500)
    }
  }

  /* 滚动加载函数 */
  lozyloading(cells, images) {
    const scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
    const winHeight = window.innerHeight;
    let flag = true;
    for( let i = 0; i < cells.length; i++) {
      if(cells[i].offsetTop < scrollTop + winHeight && images[i].getAttribute('src') == null) {
        images[i].src = images[i].getAttribute('data-src');
        flag = false;
      }
    }
    if(!flag){
      // 进行实时动态刷新
      this.viewer.update()
    }
  }

  async loadMoreCells() {
    const cells = await this.appendCells()
    this.adjustCells(cells)
    const images = document.querySelectorAll('img');
    this.lozyloading(cells, images);
    window.onscroll  = () => {
       this.lozyloading(cells, images)
    }
  }

  async appendCells() {
    const data = await this.fetchData()
    const fragment = document.createDocumentFragment()
    const cells = []
    data.forEach((item, index) => {
        const cell = document.createElement('div')
        if (item.original != null && String(item.original).indexOf("http") < 0) {
          item.original = this.ROOT_URL + item.original
        }
        if (item.compression != null && String(item.compression).indexOf("http") < 0) {
          item.compression = this.ROOT_URL + item.compression
        }
        cell.classList.add('cell')
        cell.innerHTML = `
            <div 
            class="box"
            >
              <div class="img-box"
              >
                <img 
                id="img_${index}"
                class="imagebox"
                data-original="${item.original}" 
                data-src="${item.compression}" 
                width="${this.COLUMN_WIDTH}" 
                alt="${item.title}"
                height="${item.height * this.COLUMN_WIDTH / item.width}" 
                loading="lazy"
                >
              </div>
              <div class="text-box" id="text_${index}">
                <div>
                  <h2>${item.title}</h2>
                  <p>${item.description}</p>
                </div>
              </div>
            </div>
            
            <div class="loading" id="loading_${index}">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
        `
        cell.style.width = this.COLUMN_WIDTH + "px"
        cell.style.height = item.height * this.COLUMN_WIDTH / item.width + "px"
        cells.push(cell)
        fragment.appendChild(cell)
    })
    

    this.container.appendChild(fragment)
    // 绑定监听函数进行动画图片加载
    var timer = setInterval(function(){
      for(var index = 0; index < cells.length; ++index) {
        if (document.getElementById('img_' + index).complete && document.getElementById('img_' + index).getAttribute("src") != null){
          this.PIC_LOADING_NUM ++;
          document.getElementById('loading_' + index).setAttribute("hidden", true)
        }
      }
      if (this.PIC_LOADING_NUM == cells.length - 1) {
        clearInterval(timer);
      }
    }, 300);

    // 进行实时动态刷新
    this.viewer.update()
    return cells
  }

  adjustCells(cells) {
    cells.forEach(cell => {
      const minHeight = Math.min(...this.columnHeights)
      const indexOfMinHeight = this.columnHeights.indexOf(minHeight)
      cell.style.left = indexOfMinHeight * (this.COLUMN_WIDTH + this.GAP_WIDTH) + 'px'
      cell.style.top = minHeight + 'px'
      this.columnHeights[indexOfMinHeight] =  minHeight + this.GAP_WIDTH + cell.offsetHeight
    })
    this.container.style.height = Math.max(...this.columnHeights) + 'px'
  }

  reflowCells() {
    if (document.body.offsetWidth != this.WINDOW_WIDTH) {
      
      if (document.body.offsetWidth <= 500) {
        this.COLUMN_WIDTH = document.body.offsetWidth - 2 * this.GAP_WIDTH;
      } else {
        this.COLUMN_WIDTH = 500;
      }
      // 充值cell 变量的width
      $(".cell").css({"width": this.COLUMN_WIDTH + "px"});
      this.WINDOW_WIDTH = document.body.offsetWidth
      this.resetColumnCount()
      this.resetHeights()
      this.adjustCells(Array.from(this.container.children))
      // 进行实时动态刷新
      this.viewer.update()
    }
  }

  // fetchData() {
  //   return fetch('http://192.168.5.2:5000/picture/get').then(res => res.json())
  // }

  // 模拟数据
  async fetchData() {
    return imgData
  }
}

