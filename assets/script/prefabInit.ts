const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    @property(cc.Node)
    bg:cc.Node=null;
    @property(cc.Label)
    rankLabel:cc.Label=null;
    @property(cc.Label)
    scoreLabel:cc.Label=null;
    @property(cc.Label)
    nameLabel:cc.Label=null;
    @property(cc.Sprite)
    imageSprite:cc.Sprite=null;
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    public init(rank:number,playerData):void{
        if(rank%2==0){
            this.bg.color=new cc.Color(255, 0, 0, 255);
        }
        else if(rank%2!=0){
            this.bg.color=new cc.Color(0, 0, 0, 255);
        }
        this.rankLabel.string=rank.toString();
        this.nameLabel.string=playerData.nickname;
        this.scoreLabel.string=playerData.KVDataList[0].value;
        this.createImage(playerData.avatarUrl);
    }

    /**
     * 
     * @param avatarUrl 头像url
     * @function 根据传入头像url生成头像sprite
     */
    public createImage(avatarUrl):void{
        let image=window['wx'].createImage();
        image.onLoad=()=>{
            image.src=avatarUrl;
            let texture=new cc.Texture2D();
            texture.initWithElement(image);
            this.imageSprite.spriteFrame=new cc.SpriteFrame(texture);
        }

    }
    start () {

    }

    // update (dt) {}
}
