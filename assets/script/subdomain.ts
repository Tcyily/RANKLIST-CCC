const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    scrollView: cc.Node = null;

    @property(cc.Node)
    content: cc.Node = null;

    @property(cc.Node)
    itemPrefab:cc.Prefab = null;

    CC_WECHATGAME:boolean = true;
    // LIFE-CYCLE CALLBACKS:

     onLoad () {
        this.close();
        if(this.CC_WECHATGAME){
            window['wx'].onMessage(data => {
                if(data.messageType == 0){//关闭排行榜
                    this.close();
                }
                else if(data.messageType == 1){//显示排行榜
                    this.open(data.RANK_LIST);
                }
                else if(data.messageType == 2){//提交分数
                    this.submit(data.RANK_LIST,data.score);
                }
            })
        }

     }

     public submit(RANK_LIST:string,score:number):void{
            if(this.CC_WECHATGAME){
                window['wx'].getUserCloudStorage({
                    keyList: [RANK_LIST], 
                    success: (getres) => {
                        cc.log("i receive the res in the submit function");
                        if(getres.KVDataList.length!=0){
                            if(getres.KVDataList[0].value>score)
                                return;//未打破记录不提交
                            else{
                                window['wx'].setUserCloudStorage({
                                    KVDataList: [{key:RANK_LIST,value:score.toString()}],
                                    success:function(res){
                                        cc.log("i have break the record success");
                                    },
                                    fail:function(res){
                                        cc.log("i have break the record fail");
                                    },
                                    complete:function(res){
                                        cc.log("i have break the record complete");
                                    }
                                });
                            }
                        }
                    },
                    fail:function(getres){
                        cc.log("i receive the res in the submit function fail");
                    },
                    complete:function(getres){
                        cc.log("i receive the res in the submit function complete");
                    }
                });
            }
            else{
                cc.log("i want to submit my score but i'm in the wechatgame");
            }
     }
     public open(RANK_LIST:string):void{
        this.scrollView.active=true;
        if(this.CC_WECHATGAME){
            window['wx'].getUsetInfo({
                openList:['selfOpenId'],
                success:(userRes)=>{
                    cc.log("i'm opening the ranking list in success func");
                    let userData = userRes.data[0];
                    window['wx'].getFriendCloudStorage({
                        keyList:['RANK_LIST'],
                        success : res => {
                            let data = res.date;
                            data.sort((a, b) => {
                                if (a.KVDataList.length == 0 && b.KVDataList.length == 0) {
                                    return 0;
                                }
                                if (a.KVDataList.length == 0) {
                                    return 1;
                                }
                                if (b.KVDataList.length == 0) {
                                    return -1;
                                }
                                return b.KVDataList[0].value - a.KVDataList[0].value;
                            });
                            for(let i = 0;i<data.length;i++){
                                let playerData=data[i];
                                let item = cc.instantiate(this.itemPrefab);
                                item.setParent(this.content);
                                item.getComponent("prefabInit").init(i,playerData);
                                this.content.getComponent(cc.Layout).updateLayout;
                                this.content.height=(item.height/2 + -item.y)+10;
                            }
                        }
                    });
                },
                fail:(userRes)=>{
                    cc.log("i'm opening the ranking list in fail func");
                },
                complete:(userRes)=>{
                    cc.log("i'm opening the ranking list in complete func");
                }
            });
         }
     }
     public close():void{
        this.content.removeAllChildren();
        this.scrollView.active=false;
     }
    start () {
    }

    // update (dt) {}
}
