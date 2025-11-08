import type { Dominion, Trait, ChoiceItem } from '../types';

export const DOMINIONS: Dominion[] = [
  {
    id: 'halidew',
    title: 'HALIDEW STATION',
    description: "The most powerful dominion, consisting of beautiful flying cities hovering above the immense ocean that was once the Atlantic Ocean. It is a center of industry and innovation; almost all new developments in spellcraft and magitech come from this Dominion's brilliant engineers. Mages from here love magitech and creativity.",
    imageSrc: 'https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/Pg1/reg1.jpg',
  },
  {
    id: 'shinar',
    title: 'SHINAR',
    description: "Centered around the Tower of Babel, this is the most ancient home of mages on Earth, and the very ground hums with magical radiance from the eons of spells cast upon its surface. It has a rather spooky aesthetic, and is host to countless mysterious, millenia-old families and clans, honing their trades in private. Mages from here love dark magic and secrecy.",
    imageSrc: 'https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/Pg1/reg2.jpg',
  },
  {
    id: 'unterseeisch',
    title: 'THE UNTERSEEISCH',
    description: "Starting as refugee havens as the Sinthru Uprising battered the surface, countless cities and treasure-laden ruins riddle the surface of the Pacific. Thanks to various enchantments, residents can breathe and walk around underwater just as easily as on land. Tech and magic live in harmony, and it's very laid-back. Mages from here love telepathy and charisma.",
    imageSrc: 'https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/Pg1/reg3.jpg',
  },
  {
    id: 'valsereth',
    title: 'VALSERETH',
    description: "To call it subterranean is misleading; in reality, the Earth is a flat disk, and this Dominion hangs from its underbelly, above the beautiful bright void we call the Othersky. This ancient magocratic society shuns technology, and its brilliant intelligentsia is dedicated to pushing Blessings to their absolute limit. Mages from here love metamagic and shows of power.",
    imageSrc: 'https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/Pg1/reg4.png',
  },
  {
    id: 'gohwood',
    title: 'GOHWOOD',
    description: "A snowy, feudal land still proud of its heritage and rooted in its stern political traditions. It's famous for its great and honorable knights, who were instrumental in fighting off the Sinthru Covens all those years ago. They don't shun technology like Valsereth, but look down strongly upon any overreliance. Mages from here love alchemy and fair combat.",
    imageSrc: 'https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/Pg1/reg5.jpg',
  },
  {
    id: 'palisade',
    title: 'NEW PALISADE',
    description: "The most population dense Dominion by far, but Mages are very rare; high technology is generally preferred over magic here, since the latter tends to interfere with nearby electronic devices. Still, there's room to break through the stigma and become a big celebrity. Perfect for those who like hustle and bustle. Mages from here love technomancy and grandiosity.",
    imageSrc: 'https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/Pg1/reg6.jpg',
  },
  {
    id: 'rovines',
    title: 'THE ROVINES',
    description: "What's left of much of Europe: concrete ruins rising above the Baltic Sea which floods the place. No central government. Instead, all sorts of people build small settlements among the ruins, creating a diaspora of cultures. Very massive and low density - perfect for those who prefer quiet, rural living. Mages from here love being well-rounded jacks-of-all-trades.",
    imageSrc: 'https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/Pg1/reg7.jpg',
  },
  {
    id: 'jipangu',
    title: 'JIPANGU',
    description: "An island locked in an eternal autumn, where new innovations coexist with ancient traditions. Not too big, but with the highest density of mages in the world, and they are particularly venerated here, with each getting their own shrine for their fans and even their worshippers to congregate at. Mages here love individuality and creating unique spells.",
    imageSrc: 'https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/Pg1/reg8.jpg',
  },
];

export const TRAITS_DATA: { positive: Trait[]; negative: Trait[] } = {
  positive: [
    { id: 'blessed', title: 'BLESSED (Female only)', cost: 'Costs -5 FP and -5 BP', description: "She's a Mage, just like you! Design her using 35 Companion Points on the Reference Page.", imageSrc: 'https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/Pg1/trait1.png' },
    { id: 'badass', title: 'BADASS', cost: 'Costs -3 FP', description: "Either they've got combat experience, or they're just naturally tough. Either way, bullies should beware!", imageSrc: 'https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/Pg1/trait2.png' },
    { id: 'brilliant', title: 'BRILLIANT', cost: 'Costs -3 FP', description: "They've got a genius-level IQ and tons to teach you! Expect to get lots of help on your homework.", imageSrc: 'https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/Pg1/trait3.png' },
    { id: 'role_model', title: 'ROLE MODEL', cost: 'Costs -3 FP', description: "Hard-working, altruistic, kind... they're the pinnacle of whatever you consider the ideal kind of person to be.", imageSrc: 'https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/Pg1/trait4.png' },
    { id: 'loaded', title: 'LOADED (Parent only)', cost: 'Costs -3 FP', description: "They have an extremely high-paying and prestigious job that lets them spoil you to your heart's content.", imageSrc: 'https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/Pg1/trait5.png' },
    { id: 'doting', title: 'DOTING', cost: 'Costs -2 FP', description: "Even for family, they are incredibly affectionate, and would happily lay down their life for you.", imageSrc: 'https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/Pg1/trait6.png' },
    { id: 'peas_in_pod', title: 'PEAS IN A POD', cost: 'Costs -3 FP', description: "You share very similar beliefs, hobbies, opinions, energies, and are generally on the same wavelength.", imageSrc: 'https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/Pg1/trait7.png' },
    { id: 'creative_savant', title: 'CREATIVE SAVANT', cost: 'Costs -2 FP', description: "They're a prodigy in some manner of creative trade, and more than happy to make you stuff or teach you.", imageSrc: 'https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/Pg1/trait8.png' },
    { id: 'forgiving', title: 'FORGIVING (Parent/Older Sibling only)', cost: 'Costs -3 FP', description: "Incompatible with Strict. They act more like a buddy than like a parent, letting you get away with more.", imageSrc: 'https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/Pg1/trait9.png' },
    { id: 'stacked', title: 'STACKED', cost: 'Costs -2 FP', description: "They are the pinnacle of physical fitness and can help train your strength both in body and mind.", imageSrc: 'https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/Pg1/trait10.png' },
    { id: 'handyman', title: 'HANDYMAN', cost: 'Costs -1 FP', description: "They have a near supernatural ability to quickly repair anything and keep the home in perfect order.", imageSrc: 'https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/Pg1/trait11.png' },
    { id: 'great_chef', title: 'GREAT CHEF', cost: 'Costs -1 FP', description: "Everyone begs to try their cooking after hearing about the restaurant-quality meals they whip up!", imageSrc: 'https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/Pg1/trait12.png' },
  ],
  negative: [
    { id: 'bombshell', title: 'BOMBSHELL', cost: 'Grants +1 FP', description: "'Stacy's mom has got it goin' on!' Expect this to earn you cheap popularity with your peers.", imageSrc: 'https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/Pg1/trait13.png' },
    { id: 'strict', title: 'STRICT (Parent/Older Sibling only)', cost: 'Grants +1 FP', description: "Incompatible with Forgiving. They just want what's best for you, but they can be pretty unfair at times...", imageSrc: 'https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/Pg1/trait14.png' },
    { id: 'disobedient', title: 'DISOBEDIENT (Younger Sibling only)', cost: 'Grants +2 FP', description: "They have a strong urge to rebel against you and any other authority, and generally cause lots of trouble.", imageSrc: 'https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/Pg1/trait15.png' },
    { id: 'physically_disabled', title: 'PHYSICALLY DISABLED', cost: 'Grants +4 FP', description: "They are a pseudo-Distortion who will need extra help with even basic physical activities.", imageSrc: 'https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/Pg1/trait16.png' },
    { id: 'mentally_disabled', title: 'MENTALLY DISABLED', cost: 'Grants +6 FP', description: "They are a pseudo-Distortion who will struggle taking care of themselves, much less others.", imageSrc: 'https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/Pg1/trait17.png' },
    { id: 'abusive', title: 'ABUSIVE (Parent only)', cost: 'Grants +12 FP', description: "How'd someone this vile even get past the selection process? Somebody must have been bribed!", imageSrc: 'https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/Pg1/trait18.png' },
  ]
};

export const HOUSES_DATA: ChoiceItem[] = [
  { id: 'ragamuffin', title: 'RAGAMUFFIN', cost: 'Grants +15 FP', description: "Required if no parents or older sibling. Requires 0 parents. Cannot take vacation homes or upgrades. Mage childrearing programs are usually near flawless, yet you somehow fell through the cracks! Did you run away, or get abandoned? Whatever the case, you're out on the streets, kiddo.", imageSrc: 'https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/Pg1/home1.jpg' },
  { id: 'apartment', title: 'APARTMENT', cost: 'Costs 0 FP', description: "This category can also include duplexes, lofts, and even modest cabins. Of course, even the most modest of accommodations for a mage are pretty comfy and luxurious, so you'll have around 2,000 sq ft of floor space with all the modern comforts. Your bedroom will be pretty huge, too!", imageSrc: 'https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/Pg1/home2.jpg' },
  { id: 'house', title: 'HOUSE', cost: 'Costs -2 FP', description: "Even more roomy and comfortable than most apartments, at 4,000 sq ft total, and even features a second floor for extra privacy. Enchantments allow the house to clean itself automatically, a restaurant-worthy kitchen, and a bunch of extra rooms that can be customized freely.", imageSrc: 'https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/Pg1/home3.jpg' },
  { id: 'luxury_suite', title: 'LUXURY SUITE', cost: 'Costs -3 FP', description: "You're really living like a king now! Everything from the doorknobs to the curtains oozes wealth and excess, and you can control the various devices in the house in a million different ways with your thoughts alone. At 6,000 sq ft, you'll have plenty of room to work with.", imageSrc: 'https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/Pg1/home4.jpg' },
  { id: 'mansion', title: 'MANSION', cost: 'Costs -7 FP', description: "The most opulent sort of home imaginable. Robot butlers make you breakfast in bed, telepathic sensors detect the perfect level of warmth for your blankets at night as well as surrounding you with comforting illusions. The works. Starts at 8,000 sq ft, but can buy more for -1 FP per 1,000 sq ft.", imageSrc: 'https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/Pg1/home5.jpg' },
];

export const HOUSE_UPGRADES_DATA: ChoiceItem[] = [
  { id: 'mythical_pet', title: 'MYTHICAL PET', cost: 'Costs -5 FP and -5 BP', description: "You get a loyal, intelligent, and powerful mythical beast pet that has run down your family line for many generations. Spend 30 Beast Points designing it on the Reference Page. Know that, if it dies, it dies for good, however.", imageSrc: 'https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/Pg1/uph1.png' },
  { id: 'swimming_pool', title: 'SWIMMING POOL', cost: 'Costs -2 FP', description: "Varies in size depending on the size of your property: with a mansion and private island, it's basically a private water park! Can be equipped with waterslides, lazy rivers, hot tubs, and et cetera.", imageSrc: 'https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/Pg1/uph2.png' },
  { id: 'farmer', title: 'FARMER', cost: 'Costs -1 FP', description: "Your house is a farm or a ranch for beasts! On the upside, it's a cooler, more bustling place to live. On the downside, it's more dirty and smelly, and you'll have to do farmyard chores.", imageSrc: 'https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/Pg1/uph3.png' },
  { id: 'virtual_reality', title: 'VIRTUAL REALITY CHAMBER', cost: 'Costs -3 FP or -2 BP', description: "Powered either by technology or magic, this chamber allows you to vividly enjoy all kinds of downloadable experiences in the Web. It feels so real! Just be careful not to get too addicted...", imageSrc: 'https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/Pg1/uph4.png' },
  { id: 'home_entertainment', title: 'HOME ENTERTAINMENT', cost: 'Costs -2 FP', description: "This consists of two large rooms: your very own home theater with comfy, reclinable leather seats, and an entire arcade boasting all the greatest games! Expect your friends to be begging to come over.", imageSrc: 'https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/Pg1/uph5.png' },
  { id: 'creepy_crawlies', title: 'CREEPY CRAWLIES', cost: 'Grants +2 FP', description: "Your house is prone to infestations, and you'll get a new one every three or four years. Roaches are hard enough to get rid of already, but magic roaches? You'll need a strong will, and a stronger stomach.", imageSrc: 'https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/Pg1/uph6.png' },
  { id: 'great_neighbors', title: 'GREAT NEIGHBORS', cost: 'Costs -2 FP', description: "Conflicts with Terrible Neighbors. Your neighbors are really awesome and cheerful! In fact, you can choose one purchased Classmate to have been your nextdoor best friend since the day of your birth.", imageSrc: 'https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/Pg1/uph7.png' },
  { id: 'great_view', title: 'GREAT VIEW', cost: 'Costs -1 FP', description: "Your house is perched on a beautiful vista! Maybe it's right on a cozy beach, or nestled up on a gorgeous mountainside? Or maybe it's even on a tower overlooking a sprawling cityscape? It's up to you.", imageSrc: 'https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/Pg1/uph8.png' },
  { id: 'terrible_neighbors', title: 'TERRIBLE NEIGHBORS', cost: 'Grants +2 FP', description: "Conflicts with Great Neighbors. Your neighbors are pretty much terrible. Well, they aren't all bad, but expect a handful to occasionally stir up strife and drama for pretty much no reason.", imageSrc: 'https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/Pg1/uph9.png' },
  { id: 'private_island', title: 'PRIVATE ISLAND', cost: 'Costs -8 FP', description: "Your family owns its very own private island! Most of it is wilderness, so there's lots of places to explore and develop. It starts at 3 square miles; you can buy more in 1,000 sq mile increments for -1 FP each.", imageSrc: 'https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/Pg1/uph10.png' },
  { id: 'business', title: 'BUILT-IN BUSINESS', cost: 'Costs +0 FP', description: "Part of your house is actually a family business of some kind, such as a store or performance stage. This means many folk will be coming and going, which can be a good or bad thing depending.", imageSrc: 'https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/Pg1/uph11.png' },
  { id: 'haunted', title: 'HAUNTED', cost: 'Grants +3 FP', description: "Your home was built on a cursed burial ground and is thus infested by a bunch of ghosts who are complete jerks, with a penchant for scaring, annoying or otherwise inconveniencing you. Can't get rid of 'em.", imageSrc: 'https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/Pg1/uph12.png' },
];

export const TRUE_SELF_TRAITS: ChoiceItem[] = [
  { id: 'neoteny', title: 'NEOTENY', cost: 'Grants +3 BP', description: "Body modification magic is so easy that most people can just choose what physical age they want to be. However, many Mages suffer from NDS (Neotenic Development Syndrome) which ensures they are small and adorable forever. In your day-to-day life, it will be hard to get people to take you seriously.", imageSrc: 'https://i.ibb.co/wZDFdg6k/true1.jpg' },
  { id: 'spidey_sense', title: 'SPIDEY SENSE', cost: 'Costs -4 BP', description: "Mages are at their most vulnerable while in their true forms. With this, if you're going to be in danger, you will automatically transform without having to consciously decide to, right in the nick of time. This is best for those who plan on not keeping their identity a secret; it probably won't be too useful otherwise.", imageSrc: 'https://i.ibb.co/kgvbTVmj/true2.jpg' },
  { id: 'magician', title: 'MAGICIAN', cost: 'Costs -Variable', description: "You can use your Blessings while in your true form; however, its total cost will be multiplied by 1.25x. If someone sees your true self using magic, it will be obvious that you're secretly a mage, though they won't necessarily know which mage. Can be purchased as many times as you want.", imageSrc: 'https://i.ibb.co/sJ50vBB2/true3.jpg' },
  { id: 'y_chromosome', title: 'Y CHROMOSOME', cost: 'Costs 0 BP', description: "Oh my! You're a pseudo-Distortion! Mages are made in the image of the kidnapped child of God, whom Mother uses to bring all magic into the world. One in a million are born male. If you'll definitely be quite popular with the other mages. Your alter ego will be a boy too, albeit more androgynous.", imageSrc: 'https://i.ibb.co/M5t9ZSxM/true4.jpg' },
];

export const ALTER_EGO_TRAITS: ChoiceItem[] = [
  { id: 'unique_appearance', title: 'UNIQUE APPEARANCE', cost: 'Costs -2 BP', description: "Your overall shape stays the same, but you can modify other details. This can be as simple as changing your hair color, to as complex as making your hair style defy gravity, appear to be made of fire or the night sky, or making your skin purple and your eyes glow like sapphires. Get creative!", imageSrc: 'https://i.ibb.co/Dc72VTQ/true5.jpg' },
  { id: 'exotic_appearance', title: 'EXOTIC APPEARANCE', cost: 'Costs -2 BP', description: "Requires Unique Appearance. As long as you maintain a generally humanoid form, you can now add new features to your body altogether, like fur, weird ears, or whatever else springs to your mind. This is quite rare, so expect to really stand out even compared to your fellow mages.", imageSrc: 'https://i.ibb.co/sJ1ng6JK/true6.jpg' },
  { id: 'inhuman_appearance', title: 'INHUMAN APPEARANCE', cost: 'Costs -2 BP', description: "Requires Exotic Appearance. At this point, you don't even have to look vaguely humanoid. Such mages are extremely rare, so you'll definitely stand out, for better or worse. Create your monstrous form with 40 Beast Points on the Reference Page excluding options marked with an *.", imageSrc: 'https://i.ibb.co/Z1T8CWbb/true7.jpg' },
  { id: 'power_requirement', title: 'POWER REQUIREMENT', cost: 'Grants +4 BP', description: "There's something or another you need regularly, or your powers will gradually drain. It can range from natural things like sunlight, to products like a certain chemical, to even things like friendship or a true love's kiss. The rarer it is, the slower your power drains when you are parted from it.", imageSrc: 'https://i.ibb.co/Cs6PnsR6/true8.jpg' },
  { id: 'power_weakness', title: 'POWER WEAKNESS', cost: 'Grants +2-8 BP', description: "There's something or another you need to avoid, or it will temporarily sap you of your powers. It can range from physical objects like a certain crystal, to more aethereal things like a keyword or emotion. The more common it is, the less severe its effects are on you. Your enemies might figure out this weakness!", imageSrc: 'https://i.ibb.co/Y75jnr4T/true9.jpg' },
  { id: 'signature_vehicle', title: 'SIGNATURE VEHICLE', cost: 'Costs -4 BP and -1 FP', description: "Create a vehicle on the Reference Page using 30 Vehicle Points. To assign a vehicle, click the icon in the top-right corner. Your chosen vehicle will spawn at your location every time you transform to your alter ego. If it's destroyed, it will reappear the next time you transform again. Not super practical, but guarantees you lots of style points!", imageSrc: 'https://i.ibb.co/d4H3tzN0/true10.jpg' },
  { id: 'rival', title: 'RIVAL', cost: 'Grants +7 FP', description: "You have a self-professed rival! Their personality is seemingly fine-tuned to piss you off to the maximum possible extent, and their powers are almost designed to counter your own. No matter what you do, you can never seem to get rid of them for very long, and they're immune to psychic control.", imageSrc: 'https://i.ibb.co/bMr6ybW3/true11.jpg' },
  { id: 'corporate_mascot', title: 'CORPORATE MASCOT', cost: 'Grants +6 BP', description: "Some lobby major company or another is sponsoring your career! They'll make life easier for you, at the cost of plastering their logo all over your dress, magical styles, and making you complete 4 Jobs from page 3 without the usual rewards. Some people will consider you a sellout.", imageSrc: 'https://i.ibb.co/HDMW2Lry/true12.jpg' },
];

export const UNIFORMS_DATA: ChoiceItem[] = [
    { id: 'idol', title: 'IDOL', cost: 'Costs -1 FP', description: "This describes a large variety of outfits, mostly typified by bright colors, frilly dresses, big bows, and other girly things. Based on musical performers, this sort of outfit has been getting very popular amongst the younger generation of mages.", imageSrc: 'https://i.ibb.co/nq7Q3fPk/uni1.jpg' },
    { id: 'witchy', title: 'WITCHY', cost: 'Costs -1 FP', description: "This used to be the most popular uniform for many millennia, but nowadays it's just about tied with Idol. Nowadays, this aesthetic is associated with traditional mages and ancient (and often spooky) magic, though anybody can wear it.", imageSrc: 'https://i.ibb.co/yctKx4qM/uni2.png' },
    { id: 'boyish', title: 'BOYISH', cost: 'Costs -1 FP', description: "Not everybody wants to be the peak of femininity. This aesthetic encapsulates a range of outfits typically worn by guys and tomboys. Tends to be a tad boring, but at least you will look more cool and professional, and will be taken more seriously.", imageSrc: 'https://i.ibb.co/HLygQPpV/uni3.jpg' },
    { id: 'high_tech', title: 'HIGH TECH', cost: 'Costs -1 FP', description: "Pretty common in New Palisade, but you'll look kinda weird elsewhere. Still, these bodysuits and armor panels are just so comfortable and convenient! They even have hologram systems built in that let you browse the web from anywhere.", imageSrc: 'https://i.ibb.co/xqX87CjN/uni4.jpg' },
    { id: 'animal_themed', title: 'ANIMAL-THEMED', cost: 'Costs -1 FP', description: "You're really trying to crank the cuteness dial up to maximum, huh? Well, you'll be well-liked wherever you go, but don't expect people to assume you're tough or competent. But maybe you want your enemies to underestimate you?", imageSrc: 'https://i.ibb.co/zcBTCCq/uni5.jpg' },
    { id: 'old_timey', title: 'OLD TIMEY', cost: 'Costs -1 FP', description: "About a century or two ago, these kinds of outfits looked like they were about to take off, but then the Idol aesthetic came along and stole the spotlight. Still, these dresses are the perfect balance of cuteness and professionalism.", imageSrc: 'https://i.ibb.co/C3GNxfSQ/uni6.jpg' },
    { id: 'oriental', title: 'ORIENTAL', cost: 'Costs -1 FP', description: "While the 'witchy' aesthetic dominated elsewhere for most of history, mages in Jipangu have always had a completely different sort of traditional dress. You might get funny looks wearing it elsewhere, but it's the perfect mix of class and beauty.", imageSrc: 'https://i.ibb.co/HD6zcHfW/uni7.jpg' },
    { id: 'custom', title: 'CUSTOM', cost: 'Costs -1 FP', description: "Daringly defy fashion standards and come up with your own unique style! This will definitely help you stand out in a crowd, but who knows? If you get famous, other people might be inspired by your style. The sky's the limit with this option.", imageSrc: 'https://i.ibb.co/nsJ8cqtz/uni8.png' },
];

export const MAGICAL_STYLES_DATA: ChoiceItem[] = [
    { id: 'generic', title: 'GENERIC', cost: 'Costs 0 BP', description: '', imageSrc: 'https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/Pg1/vis1.png' },
    { id: 'light_sun', title: 'LIGHT/SUN', cost: 'Costs -1 BP', description: '', imageSrc: 'https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/Pg1/vis2.png' },
    { id: 'dark_moon', title: 'DARK/MOON', cost: 'Costs -1 BP', description: '', imageSrc: 'https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/Pg1/vis3.png' },
    { id: 'fire_smoke', title: 'FIRE/SMOKE', cost: 'Costs -1 BP', description: '', imageSrc: 'https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/Pg1/vis4.png' },
    { id: 'water_bubbles', title: 'WATER/BUBBLES', cost: 'Costs -1 BP', description: '', imageSrc: 'https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/Pg1/vis5.png' },
    { id: 'nature', title: 'NATURE', cost: 'Costs -1 BP', description: '', imageSrc: 'https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/Pg1/vis6.png' },
    { id: 'hearts', title: 'HEARTS', cost: 'Costs -1 BP', description: '', imageSrc: 'https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/Pg1/vis7.png' },
    { id: 'snow_ice', title: 'SNOW/ICE', cost: 'Costs -1 BP', description: '', imageSrc: 'https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/Pg1/vis8.png' },
    { id: 'electricity', title: 'ELECTRICITY', cost: 'Costs -1 BP', description: '', imageSrc: 'https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/Pg1/vis9.png' },
    { id: 'confetti', title: 'CONFETTI', cost: 'Costs -1 BP', description: '', imageSrc: 'https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/Pg1/vis10.png' },
    { id: 'stars', title: 'STARS', cost: 'Costs -1 FP', description: '', imageSrc: 'https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/Pg1/vis11.png' },
    { id: 'bugs', title: 'BUGS', cost: 'Costs -1 FP', description: '', imageSrc: 'https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/Pg1/vis12.png' },
    { id: 'earth_rocks', title: 'EARTH/ROCKS', cost: 'Costs -1 FP', description: '', imageSrc: 'https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/Pg1/vis13.png' },
    { id: 'digital_glitch', title: 'DIGITAL/GLITCH', cost: 'Costs -1 FP', description: '', imageSrc: 'https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/Pg1/vis14.png' },
    { id: 'neon', title: 'NEON', cost: 'Costs -1 FP', description: '', imageSrc: 'https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/Pg1/vis15.png' },
    { id: 'eldritch', title: 'ELDRITCH', cost: 'Costs -1 FP', description: '', imageSrc: 'https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/Pg1/vis16.png' },
    { id: 'cards', title: 'CARDS', cost: 'Costs -1 FP', description: '', imageSrc: 'https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/Pg1/vis17.png' },
    { id: 'music_notes', title: 'MUSIC NOTES', cost: 'Costs -1 FP', description: '', imageSrc: 'https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/Pg1/vis18.png' },
    { id: 'abstract_chaos', title: 'ABSTRACT/CHAOS', cost: 'Costs -1 FP', description: '', imageSrc: 'https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/Pg1/vis19.png' },
    { id: 'custom_style', title: 'CUSTOM', cost: 'Costs -1 FP', description: '', imageSrc: 'https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/Pg1/vis20.png' },
];

export const BUILD_TYPES_DATA: ChoiceItem[] = [
    { id: 'single_player', title: 'SINGLE PLAYER', cost: '', description: "Your build will not have to compete with anybody else's, for this adventure is yours and yours alone. This unlocks the option to choose Specific Classmates and Colleagues, though you can still make your own.", imageSrc: 'https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/Pg1/singleplay.png' },
    { id: 'multiplayer', title: 'MULTIPLAYER', cost: '', description: "You will share a world with pretty much anybody who made a build that follows the rules and which selected this option. This unfortunately means you cannot pick any Specific Classmates or Colleagues, and must instead create your own custom ones. This is a dangerous option, for other players may try to cause trouble! It is recommended that you form teams with other mages to try and keep eachother safe, and to work towards whatever your shared goals may be.", imageSrc: 'https://saviapple.neocities.org/Seinaru_Magecraft_Girls/img/Pg1/multiplay.jpg' },
];