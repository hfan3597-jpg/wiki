import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding database...");

  // Clean existing data (order matters due to FK)
  await prisma.question.deleteMany();
  await prisma.category.deleteMany();

  // -- Create 4 categories --
  const history = await prisma.category.create({
    data: {
      name: "历史",
      slug: "history",
      description: "探索古今中外的历史事件与人物",
    },
  });

  const geography = await prisma.category.create({
    data: {
      name: "地理",
      slug: "geography",
      description: "了解世界各地的自然与人文地理",
    },
  });

  const astronomy = await prisma.category.create({
    data: {
      name: "天文",
      slug: "astronomy",
      description: "仰望星空，探索宇宙的奥秘",
    },
  });

  const lifeHacks = await prisma.category.create({
    data: {
      name: "生活常识",
      slug: "life-hacks",
      description: "日常生活中的科学原理与实用知识",
    },
  });

  console.log("Categories created");

  // -- 5 Multiple Choice for 生活常识 --
  await prisma.question.createMany({
    data: [
      {
        title: "为什么不能用微波炉加热带壳的生鸡蛋？",
        type: "MULTIPLE_CHOICE",
        options: JSON.stringify([
          "鸡蛋壳会融化",
          "鸡蛋内部压力急剧升高导致爆炸",
          "微波炉会损坏鸡蛋的营养",
          "鸡蛋会变成绿色",
        ]),
        correctOption: "鸡蛋内部压力急剧升高导致爆炸",
        explanation: `微波炉加热原理是利用微波使水分子高速振动产生热量。带壳鸡蛋是一个封闭系统，加热时内部水分迅速汽化，水蒸气体积膨胀约1600倍，而蛋壳几乎不透气。当内部压力超过蛋壳承受极限（约0.3-0.5 MPa）时，鸡蛋就会剧烈爆炸。即使在微波炉里没有炸开，取出来用筷子一戳也可能喷溅，造成烫伤。正确做法：去壳打散后加热，或用牙签在蛋黄上戳几个孔。`,
        categoryId: lifeHacks.id,
      },
      {
        title: "切洋葱时为什么会流眼泪？",
        type: "MULTIPLE_CHOICE",
        options: JSON.stringify([
          "洋葱含有辣椒素",
          "洋葱释放的硫化丙烯刺激眼睛",
          "洋葱产生的花粉引起过敏",
          "切洋葱时产生的风刺激眼睛",
        ]),
        correctOption: "洋葱释放的硫化丙烯刺激眼睛",
        explanation: `切洋葱时，细胞壁被破坏，原本分隔储存的蒜氨酸酶与含硫化合物（亚砜类）混合，发生酶促反应生成1-丙烯基次磺酸。该物质在催泪因子合成酶（LFS）作用下转化为丙硫醛-S-氧化物（thiopropanal S-oxide），一种挥发性气体。当它接触眼表水膜后，水解生成微量硫酸，刺激角膜神经末梢，触发反射性流泪以稀释和冲走刺激物。有效对策：冷藏洋葱降低酶活性、在通风处切、戴护目镜、或点燃蜡烛消耗催泪气体。`,
        categoryId: lifeHacks.id,
      },
      {
        title: "打开碳酸饮料瓶盖时为什么会冒气泡？",
        type: "MULTIPLE_CHOICE",
        options: JSON.stringify([
          "瓶内空气受热膨胀逸出",
          "瓶内压力骤降，溶解的二氧化碳过饱和析出",
          "饮料中的化学物质遇到空气发生反应",
          "瓶子摇晃导致的物理现象",
        ]),
        correctOption: "瓶内压力骤降，溶解的二氧化碳过饱和析出",
        explanation: `碳酸饮料在生产时通过高压（约2-4个大气压）将大量二氧化碳（CO₂）强制溶解于液体中，形成碳酸（H₂CO₃）。根据亨利定律，气体在液体中的溶解度与液面上方该气体的分压成正比。封瓶后，瓶内CO₂分压高，气体稳定溶解；开瓶瞬间，压力骤降至大气压，CO₂溶解度大幅下降，溶液处于过饱和状态，过量CO₂迅速以气泡形式从液体中逸出——这就是我们看到的气泡涌现。温度越高，气体溶解度越低，因此冰镇饮料开瓶时气泡更少，温热饮料则喷涌更剧烈。`,
        categoryId: lifeHacks.id,
      },
      {
        title: "为什么面包放久了会变硬，而饼干放久了会变软？",
        type: "MULTIPLE_CHOICE",
        options: JSON.stringify([
          "面包失水变干，饼干吸水变潮",
          "面包里的酵母继续作用",
          "面包的淀粉发生回生（老化），饼干吸水变潮",
          "面包和饼干的温度变化不同",
        ]),
        correctOption: "面包的淀粉发生回生（老化），饼干吸水变潮",
        explanation: `这看似矛盾的现象背后是两个不同的科学原理。面包变硬主要是因为淀粉回生（retrogradation）：面包烘烤时淀粉糊化吸水膨胀，冷却后支链淀粉和直链淀粉分子重新排列结晶，将水分子挤出淀粉网络——不是水分散失到空气中，而是水被"锁"在了淀粉晶体之外，面包质感变干硬。而饼干含糖量高、含水量极低（通常<5%），根据吸湿平衡原理，饼干会从潮湿空气中吸收水分，导致变软。这也解释了为什么面包不能放冰箱（低温加速淀粉回生），而饼干需要密封防潮保存。`,
        categoryId: lifeHacks.id,
      },
      {
        title: "油锅起火时为什么不能用水扑灭？",
        type: "MULTIPLE_CHOICE",
        options: JSON.stringify([
          "水会让油变得更热",
          "水遇高温油瞬间汽化，将燃烧的油溅出扩大火势",
          "水与油发生化学反应产生有毒气体",
          "水会让锅变形",
        ]),
        correctOption: "水遇高温油瞬间汽化，将燃烧的油溅出扩大火势",
        explanation: `这是一个关乎厨房安全的至关重要的问题。食用油起火时油温通常在300-400°C以上，远超水的沸点100°C。水倒入着火的油锅后，会瞬间（毫秒级）汽化成水蒸气，体积膨胀约1700倍。这个剧烈的相变过程将燃烧的热油猛烈溅出，形成火球，可能造成严重烧伤和火灾蔓延——这就是所谓的"暴沸喷溅"效应（boilover）。此外，水不能隔绝油与氧气的接触，无法起到灭火作用。正确做法：用锅盖从侧面滑入盖住油锅隔绝氧气，或使用厨房灭火毯、干粉灭火器。切勿用水！`,
        categoryId: lifeHacks.id,
      },
    ],
  });

  console.log("5 multiple-choice questions created for 生活常识");

  // -- 2 QA for 历史 --
  await prisma.question.createMany({
    data: [
      {
        title: "秦始皇统一六国后推行了哪些重要的标准化政策？",
        type: "QA",
        answer: `秦始皇统一六国后，推行了"书同文、车同轨、度同制"等一系列标准化政策。文字上，命李斯以秦国小篆为基础统一全国文字；交通上，统一车轨宽度，修建驰道；经济上，统一度量衡和货币，推行秦半两；行政上，废除分封制，推行郡县制，将全国分为三十六郡。这些措施极大地促进了中国经济文化的统一和中央集权制度的建立。`,
        explanation: `秦始皇的统一标准化政策是中国历史上首次大规模的国家治理工程，对后世影响深远。郡县制打破了世袭贵族对地方的掌控，建立了中央直管的高效行政体系，这一模式被此后两千多年的历代王朝沿袭。`,
        categoryId: history.id,
      },
      {
        title: "丝绸之路在中国历史中扮演了什么角色？",
        type: "QA",
        answer: `丝绸之路是古代连接中国与中亚、西亚乃至欧洲的陆上贸易通道网络，始于西汉张骞出使西域（公元前138年）。它不仅是丝绸、瓷器、茶叶等中国商品输出的商路，更是东西方文明交流的大动脉——佛教通过丝路传入中国，中国的造纸术、火药、印刷术也经由丝路西传。丝路沿线的敦煌、撒马尔罕等城市成为文明交融的璀璨节点。`,
        explanation: `丝绸之路并非一条单一道路，而是一个庞大的贸易网络。德国地理学家李希霍芬（Ferdinand von Richthofen）于1877年首次提出"丝绸之路"（Seidenstraße）这一术语，从此成为描述欧亚大陆古代贸易通道的通用名称。2013年中国提出的"一带一路"倡议，其概念溯源正是这条古老的商路。`,
        categoryId: history.id,
      },
    ],
  });

  console.log("2 QA questions created for 历史");

  // -- 2 QA for 地理 --
  await prisma.question.createMany({
    data: [
      {
        title: "为什么喜马拉雅山脉还在不断升高？",
        type: "QA",
        answer: `喜马拉雅山脉是印度板块与欧亚板块持续碰撞的结果。约5000万年前，印度板块以每年约15-20厘米的速度向北漂移并撞击欧亚板块，板块挤压使地壳褶皱隆起形成山脉。目前印度板块仍以每年约5厘米的速度向北推进，导致喜马拉雅山脉每年平均抬升约1厘米，珠穆朗玛峰的高度也因此在缓慢增长。这一过程伴随着频繁的地震活动，是板块构造学说的生动例证。`,
        explanation: `板块构造学说是20世纪地球科学最重大的发现之一。1912年魏格纳提出大陆漂移假说时遭到广泛质疑，直到20世纪60年代海底扩张和板块构造理论的确立，才完整解释了地震、火山和造山运动的分布规律。喜马拉雅造山带是世界上最年轻、最活跃的陆-陆碰撞造山带，其研究对理解板块动力学意义重大。`,
        categoryId: geography.id,
      },
      {
        title: `死海为什么被称为"死海"？它的含盐量为什么那么高？`,
        type: "QA",
        answer: `死海位于以色列、约旦和巴勒斯坦交界处，是全球陆地最低点（海拔约-430米）。它被称为"死海"是因为含盐量高达约34%（普通海水约3.5%），绝大多数生物无法在其中生存。高盐度的成因：死海是一个内陆终端湖（endorheic lake），只有进水（约旦河等）没有出水口，水分只能通过蒸发排出。该地区气候炎热干燥，年蒸发量远大于降水量，水分不断蒸发而盐分（矿物质）却留在湖中，经过数百万年浓缩形成超高盐度。`,
        explanation: `死海的高密度（约1.24 kg/L）使人可以轻松漂浮在水面上，成为著名旅游胜地。但近年来死海正以惊人速度萎缩——由于约旦河水被大量引用于农业和城市用水，死海水位每年下降约1米，面积已缩小了三分之一。科学家警告如不采取措施，死海可能在2050年左右变成一个小盐池。`,
        categoryId: geography.id,
      },
    ],
  });

  console.log("2 QA questions created for 地理");

  // -- 2 QA for 天文 --
  await prisma.question.createMany({
    data: [
      {
        title: "为什么冥王星不再被认为是行星？",
        type: "QA",
        answer: `2006年，国际天文学联合会（IAU）重新定义了"行星"概念，冥王星因不满足第三条标准"已清空其轨道附近区域的天体"而被降级为"矮行星"。新定义要求行星必须同时满足三个条件：(1)围绕太阳运行；(2)质量足够大，自身的重力使其呈球体形状；(3)已清空其轨道附近区域的其他天体。冥王星所在的柯伊伯带存在大量与冥王星大小相近的冰质天体（如阋神星），它未能以引力主导其轨道区域。`,
        explanation: `冥王星降级的决定至今仍有争议。部分天文学家认为"清空轨道"的标准过于模糊——如果按此严格定义，地球也未能完全清空其轨道（存在近地小行星）。此外，新视野号探测器2015年飞掠冥王星，发回了令人惊叹的详细图像，发现冥王星拥有复杂的地质活动、氮冰冰川和稀薄大气，远比人们预想的精彩，这让很多人更加怀念它的行星地位。`,
        categoryId: astronomy.id,
      },
      {
        title: `黑洞是如何形成的？我们怎么"看"到看不见的黑洞？`,
        type: "QA",
        answer: `黑洞是由大质量恒星（约为太阳质量的20倍以上）在核聚变燃料耗尽后，核心在自身引力作用下无限坍缩形成的。当物质被压缩进一个称为"事件视界"的边界内，连光也无法逃逸。人类无法直接"看到"黑洞，但可以通过以下方式间接探测：(1)观测黑洞引力对周围恒星运动轨迹的影响；(2)检测物质落入黑洞时因剧烈摩擦加热形成的高温吸积盘发出的X射线；(3)引力波探测——2015年LIGO首次探测到两个黑洞合并产生的时空涟漪；(4)事件视界望远镜（EHT）于2019年首次拍摄到M87星系中心黑洞的"影子"。`,
        explanation: `2019年4月10日发布的人类首张黑洞照片，实际上拍摄的是M87星系中心超大质量黑洞（质量约为太阳的65亿倍）的事件视界轮廓。EHT通过连接分布在全球的8台射电望远镜，利用甚长基线干涉技术（VLBI），合成了一台相当于地球直径大小的虚拟望远镜，才得以分辨5500万光年外的这个"宇宙怪兽"。2022年，EHT又发布了银河系中心黑洞人马座A*的图像。`,
        categoryId: astronomy.id,
      },
    ],
  });

  console.log("2 QA questions created for 天文");
  console.log("Seed complete!");
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
