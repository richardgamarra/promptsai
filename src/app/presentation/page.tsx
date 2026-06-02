import {
  ArrowRight,
  Bot,
  BookOpen,
  Boxes,
  Code2,
  GitBranch,
  Gamepad2,
  Globe,
  Layers3,
  Lock,
  MessageSquareText,
  Network,
  PackageCheck,
  Rocket,
  Search,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  Workflow,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import type { ReactNode } from "react";
import { SlideContent, SlideDeck, SlideHighlight, SlideTitle } from "@/components/presentation/SlideDeck";

export const metadata = {
  title: "prompts.chat: An Open Prompt Ecosystem for the Age of Agents | Microsoft Build",
  description:
    "15-minute lightning talk at Microsoft Build: how prompts.chat grew from a GitHub repo into an open prompt ecosystem — platform, book, and game — for the age of agents.",
};

const speakerNotes = [
  "Okay, hi everyone. So I want to start with a mistake that, honestly, a lot of people make. They think that when AI models get smarter, prompts will not matter anymore — like, prompting is just a temporary trick and the next model will make it useless. But actually, for me, it's the opposite. Even the best models give you better answers when you give them better prompts. And in the age of agents, prompts are kind of like atoms — every agent is basically made of them. So no, prompts are not going away. They actually matter more than before. So in the next fifteen minutes, I want to show you why, and the open ecosystem I'm building around them: prompts.chat.",
  "But first, a quick hello. I'm Fatih. I'm a developer advocate on the WordPress team at Automattic. I also created the Awesome ChatGPT Prompts project, and I'm a GitHub Star. Okay, that's enough about me — let's actually talk about prompts.",
  "So, this whole thing actually started as a tiny GitHub repo. Just a simple list of prompts you could copy and paste. And one detail people are always surprised by — this is not new at all. I created it almost four years ago, literally about one week after OpenAI announced ChatGPT. The book came later. Honestly, back then I didn't expect much. But it kind of exploded — it became one of the most starred AI projects on GitHub, used by tens of millions of people. And that told me something: a good prompt is actually worth sharing.",
  "But here's the problem, right? Most prompts just get lost. They're hidden in screenshots, random gists, old chat history. No version, no owner, no review. That great prompt you wrote last week? It's probably gone the second you closed the tab. And okay, that's annoying for us as people — but honestly, it completely falls apart once agents are involved.",
  "So why does it fall apart for agents? Well, when an agent acts for you, the prompt is not just a casual message anymore. It's actually the plan. It's the contract. It's basically the source code for how that agent behaves. Look at this one — a role, a goal, the sources it can use, the limits, and when to stop. You really want to save and improve something like this, right? Not lose it somewhere in a chat.",
  "So this is exactly what prompts.chat does. It treats prompts as real, shareable things. You can discover good ones, fork them, keep versions, reuse them. And it's open source, so you can even host it yourself — your team actually owns its own prompt library.",
  "Now, why does being open matter so much, especially for agents? I'd say three reasons. First, you can actually read what the agent was told to do. Second, the same prompt works across different models and tools. And third, open prompts plug right into agents, editors, an MCP layer. So basically, a world full of agents needs an open world of prompts.",
  "Okay, now two things people don't really expect. The first one is a book. It's called The Interactive Book of Prompting. It's free, and it's not some boring PDF — it's actually interactive, with live demos you can try right there on the page, from the basics all the way to agents.",
  "And the second one is a game. So, this is Promi — a little robot — on an adventure through Prompt Land. It's a fun way for kids to learn how to talk to AI. Because, honestly, this skill shouldn't only be for engineers, right? It kind of belongs to everyone, including the next generation.",
  "So if you put it all together, you actually get one open loop. The repo where it all began, the platform to discover and reuse, the book to learn, the game to bring in new people, and an API and MCP layer that feeds everything back to both humans and agents. So good prompts come in, the community makes them better, and they go back out.",
  "Okay, so here's the big picture. As agents start doing real work, the prompt is how we steer them — it's becoming the interface to these systems. Now, around those prompts you need some tooling — a way to manage them, version them, test them, serve them. And a lot of people now call this the \"harness\". So, just to be clear, the harness is not the prompt itself — it's actually the tooling that keeps your prompts accurate and well-tuned. And honestly, the same model can give you very different results depending on how good that harness is. So let's keep this whole thing open, shared, and easy to improve — together.",
  "And that's pretty much it. So, come build this open prompt ecosystem with us. Check out prompts.chat, read the book, play the game with your kids, and take a look at the project on GitHub. Thank you so much — and I think we have a moment for maybe one question.",
];

type CardProps = {
  icon: LucideIcon;
  title: string;
  children: ReactNode;
  accent?: string;
};

function PixelEdge() {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 h-1.5"
      style={{
        backgroundImage:
          "repeating-linear-gradient(90deg, #F25022 0 7px, #FFB900 7px 14px, #7FBA00 14px 21px, #00A4EF 21px 28px)",
      }}
      aria-hidden
    />
  );
}

function Card({ icon: Icon, title, children, accent = "text-primary" }: CardProps) {
  return (
    <div className="relative border border-white/12 bg-white/[0.03] p-6 pt-7 shadow-sm backdrop-blur transition-transform duration-300 hover:-translate-y-1">
      <PixelEdge />
      <div className={`mb-4 flex h-12 w-12 items-center justify-center bg-primary/10 ${accent}`}>
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="mb-2 text-2xl font-bold text-foreground">{title}</h3>
      <p className="text-lg leading-relaxed text-muted-foreground">{children}</p>
    </div>
  );
}

function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-none border border-primary/40 bg-primary/10 px-4 py-2 font-mono text-sm font-semibold uppercase tracking-[0.18em] text-primary">
      {children}
    </span>
  );
}

function CodePanel({ children, title = "prompt.md" }: { children: ReactNode; title?: string }) {
  return (
    <div className="overflow-hidden rounded-none border border-border bg-zinc-950 text-zinc-100 shadow-2xl">
      <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-5 py-3">
        <div className="flex gap-2">
          <span className="h-3 w-3 rounded-none bg-red-400" />
          <span className="h-3 w-3 rounded-none bg-yellow-400" />
          <span className="h-3 w-3 rounded-none bg-green-400" />
        </div>
        <span className="font-mono text-xs text-zinc-400">{title}</span>
      </div>
      <pre className="whitespace-pre-wrap p-6 font-mono text-sm leading-relaxed md:text-base">{children}</pre>
    </div>
  );
}

function FlowStep({ icon: Icon, title, text }: { icon: LucideIcon; title: string; text: string }) {
  return (
    <div className="relative border border-white/12 bg-white/[0.03] p-5 pt-6 shadow-sm">
      <PixelEdge />
      <div className="mb-4 flex h-12 w-12 items-center justify-center bg-primary/10 text-primary">
        <Icon className="h-6 w-6" />
      </div>
      <h3 className="text-2xl font-bold">{title}</h3>
      <p className="mt-2 text-lg leading-relaxed text-muted-foreground">{text}</p>
    </div>
  );
}

export default function PresentationPage() {
  return (
    <SlideDeck notes={speakerNotes}>
      <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
        <Image
          src="/presentation/build-logo.png"
          alt="Microsoft Build"
          width={720}
          height={405}
          priority
          unoptimized
          className="mb-10 h-auto w-[20rem] md:w-[24rem]"
        />
        <div className="mb-7 flex items-center justify-center">
          <Image
            src="/logo-dark.svg"
            alt="prompts.chat logo"
            width={112}
            height={112}
            unoptimized
            className="h-24 w-24 object-contain"
          />
        </div>
        <SlideTitle className="max-w-5xl">prompts.chat</SlideTitle>
        <SlideContent className="mx-auto max-w-4xl">
          Building an <SlideHighlight>Open Prompt Ecosystem</SlideHighlight> for the Age of Agents
        </SlideContent>
        <p className="mx-auto mt-6 max-w-3xl text-lg font-medium text-muted-foreground/80 md:text-xl">
          Smarter models don&apos;t make prompts obsolete — prompts are the{" "}
          <SlideHighlight>atoms of every agent</SlideHighlight>.
        </p>
      </div>

      <div className="grid min-h-[70vh] items-center gap-8 lg:grid-cols-[1fr_0.95fr]">
        <div className="relative order-2 lg:order-1">
          <div className="absolute -left-8 top-10 h-72 w-72 rounded-none bg-primary/20 blur-3xl" />
          <div className="relative mx-auto w-full max-w-[34rem]">
            <div className="absolute -inset-4 -rotate-3 rounded-none bg-gradient-to-br from-primary/30 via-primary/10 to-transparent" />
            <div className="relative overflow-hidden rounded-none border border-border bg-background shadow-2xl">
              <Image
                src="https://github.com/f.png"
                alt="Fatih Kadir Akın profile photo"
                width={900}
                height={900}
                priority
                unoptimized
                className="aspect-square w-full object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/45 to-transparent p-8 text-white">
                <h2 className="mt-2 text-5xl font-black tracking-tight">Fatih Kadir Akın</h2>
                <p className="mt-3 max-w-md text-lg font-semibold leading-snug text-white/85">
                  Developer Advocate, WordPress @ Automattic
                  <br /> Creator of prompts.chat
                  <br /> GitHub Star
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="order-1 lg:order-2">
          <SlideTitle className="mb-5">Hi, I&apos;m Fatih.</SlideTitle>
          <SlideContent className="max-w-2xl">
            I build tools that make developers&apos; lives easier — one of them is{" "}
            <SlideHighlight>prompts.chat</SlideHighlight>.
          </SlideContent>
          <div className="mt-10 flex flex-wrap items-center gap-5">
            <div className="flex items-center gap-3 rounded-none border border-border/70 bg-background/75 px-5 py-4 shadow-sm backdrop-blur">
              <Image
                src="https://cdn.simpleicons.org/automattic/FFFFFF"
                alt="Automattic"
                width={40}
                height={40}
                unoptimized
                className="h-10 w-10"
              />
              <span className="text-xl font-bold text-foreground">Automattic</span>
            </div>
            <div className="flex items-center gap-3 rounded-none border border-border/70 bg-background/75 px-5 py-4 shadow-sm backdrop-blur">
              <Star className="h-9 w-9 text-yellow-500" />
              <span className="text-xl font-bold text-foreground">GitHub Star</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid min-h-[70vh] items-center gap-10 lg:grid-cols-2">
        <div>
          <SlideTitle>It started as a GitHub repo</SlideTitle>
          <SlideContent>
            <SlideHighlight>Awesome ChatGPT Prompts</SlideHighlight> — a simple list of copy-paste prompts that grew
            into one of the most-starred AI repositories in the world.
          </SlideContent>
          <p className="mt-6 max-w-2xl text-lg font-medium text-muted-foreground/80 md:text-xl">
            And it&apos;s not new — the repo (and later the book) are almost{" "}
            <SlideHighlight>four years old</SlideHighlight>, born just a week after OpenAI announced ChatGPT.
          </p>
        </div>
        <div className="grid gap-4">
          <Card icon={Star} title="Hundreds of thousands of stars" accent="text-yellow-500">
            One of GitHub&apos;s most popular AI projects.
          </Card>
          <Card icon={Globe} title="Tens of millions of developers">
            People copied these prompts into every AI tool imaginable.
          </Card>
          <Card icon={MessageSquareText} title="A new kind of artifact">
            The prompt itself became something worth sharing.
          </Card>
        </div>
      </div>

      <div className="flex min-h-[70vh] flex-col justify-center">
        <SlideTitle>But prompts get lost</SlideTitle>
        <div className="grid gap-6 md:grid-cols-3">
          <Card icon={Share2} title="Scattered" accent="text-orange-500">
            Trapped in screenshots, gists, and DMs.
          </Card>
          <Card icon={GitBranch} title="Unversioned" accent="text-sky-500">
            No history, no review, no ownership.
          </Card>
          <Card icon={Lock} title="Locked in chats" accent="text-red-500">
            The good ones disappear when the tab closes.
          </Card>
        </div>
        <SlideContent className="mt-10 max-w-4xl">
          Annoying for humans — and <SlideHighlight>broken for agents</SlideHighlight>.
        </SlideContent>
      </div>

      <div className="grid min-h-[70vh] items-center gap-8 lg:grid-cols-2">
        <div>
          <SlideTitle>In the age of agents, a prompt is a spec</SlideTitle>
          <SlideContent>
            When an agent acts on your behalf, the prompt stops being a casual message. It becomes the{" "}
            <SlideHighlight>contract</SlideHighlight> — the source code of behavior.
          </SlideContent>
        </div>
        <CodePanel title="agent-instructions.md">
          {`Role: Release notes agent for our repo.
Goal: Summarize merged PRs since the last tag.
Sources: GitHub API, CHANGELOG.md.
Limits: No breaking-change claims without a label.
Stop: When the draft is posted for review.
Output: Markdown, grouped by feature / fix / chore.`}
        </CodePanel>
      </div>

      <div className="grid min-h-[70vh] items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <SlideTitle>prompts.chat: an open prompt ecosystem</SlideTitle>
          <SlideContent>
            Prompts as <SlideHighlight>first-class assets</SlideHighlight> — discoverable, forkable, versioned, and
            reusable. Open source and self-hostable.
          </SlideContent>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Card icon={Search} title="Discover">
            Find a proven prompt instead of starting from scratch.
          </Card>
          <Card icon={GitBranch} title="Fork">
            Branch it, tweak it, make it yours.
          </Card>
          <Card icon={Layers3} title="Version">
            Prompts mature through review and feedback.
          </Card>
          <Card icon={PackageCheck} title="Reuse">
            Carry quality across teams, tools, and agents.
          </Card>
        </div>
      </div>

      <div className="flex min-h-[70vh] flex-col justify-center">
        <SlideTitle>Why open matters for agents</SlideTitle>
        <div className="grid gap-6 md:grid-cols-3">
          <Card icon={ShieldCheck} title="Inspectable" accent="text-emerald-500">
            You can read exactly what the agent was told to do.
          </Card>
          <Card icon={Globe} title="Portable" accent="text-sky-500">
            The same instruction travels across models and tools.
          </Card>
          <Card icon={Bot} title="Composable" accent="text-purple-500">
            Open prompts plug into agents, IDEs, and an MCP layer.
          </Card>
        </div>
        <SlideContent className="mt-10">
          An ecosystem of agents needs an <SlideHighlight>open</SlideHighlight> ecosystem of prompts.
        </SlideContent>
      </div>

      <div className="grid min-h-[70vh] items-center gap-10 lg:grid-cols-2">
        <div>
          <SlideTitle>Learn it: The Interactive Book of Prompting</SlideTitle>
          <SlideContent>
            A <SlideHighlight>free, interactive</SlideHighlight> prompt-engineering guide — with live, hands-on demos
            instead of a static PDF.
          </SlideContent>
          <div className="mt-7 space-y-3">
            <div className="flex items-center gap-3 text-lg text-muted-foreground">
              <BookOpen className="h-5 w-5 flex-none text-primary" />
              Hands-on chapters, from fundamentals to agents.
            </div>
            <div className="flex items-center gap-3 text-lg text-muted-foreground">
              <Code2 className="h-5 w-5 flex-none text-primary" />
              Runnable demos you can try right on the page.
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Pill>prompts.chat/book</Pill>
            <Pill>Open &amp; community-driven</Pill>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-[34rem]">
          <div className="absolute -inset-4 -rotate-2 rounded-none bg-gradient-to-br from-primary/30 via-primary/10 to-transparent" />
          <div className="relative overflow-hidden rounded-none border border-border bg-background shadow-2xl">
            <Image
              src="/book-cover-photo.jpg"
              alt="The Interactive Book of Prompting cover"
              width={1200}
              height={630}
              unoptimized
              className="h-auto w-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="grid min-h-[70vh] items-center gap-10 lg:grid-cols-2">
        <div>
          <SlideTitle>Play it: Promi in Prompt Land</SlideTitle>
          <SlideContent>
            A <SlideHighlight>game-based</SlideHighlight> way for kids to learn how to talk to AI — because this
            literacy belongs to everyone.
          </SlideContent>
          <div className="mt-7 space-y-3">
            <div className="flex items-center gap-3 text-lg text-muted-foreground">
              <Gamepad2 className="h-5 w-5 flex-none text-green-500" />
              Join Promi the robot on an adventure through Prompt Land.
            </div>
            <div className="flex items-center gap-3 text-lg text-muted-foreground">
              <Sparkles className="h-5 w-5 flex-none text-amber-500" />
              Kids practice asking AI for what they actually want.
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <Pill>prompts.chat/kids</Pill>
            <Pill>For the next generation</Pill>
          </div>
        </div>
        <div className="relative mx-auto w-full max-w-[19rem]">
          <div className="absolute -inset-4 rotate-2 rounded-none bg-gradient-to-br from-primary/30 via-primary/10 to-transparent" />
          <div className="relative overflow-hidden rounded-none border border-border bg-background shadow-2xl">
            <Image
              src="/presentation/kids-screenshot.png"
              alt="Promi in Prompt Land — the kids game"
              width={800}
              height={2026}
              unoptimized
              className="h-auto w-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="flex min-h-[70vh] flex-col justify-center">
        <SlideTitle>One open loop</SlideTitle>
        <div className="grid gap-5 md:grid-cols-5">
          <FlowStep icon={Star} title="Repo" text="Where it all began." />
          <FlowStep icon={Boxes} title="Platform" text="Discover, fork, version, reuse." />
          <FlowStep icon={BookOpen} title="Book" text="Learn the craft." />
          <FlowStep icon={Gamepad2} title="Game" text="Onboard the next generation." />
          <FlowStep icon={Network} title="API / MCP" text="Feed humans and agents." />
        </div>
        <SlideContent className="mt-10 max-w-4xl">
          Prompts flow in, get refined by the community, and flow back out to{" "}
          <SlideHighlight>humans and agents</SlideHighlight>.
        </SlideContent>
      </div>

      <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
        <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-none bg-primary/10 text-primary">
          <Workflow className="h-12 w-12" />
        </div>
        <SlideTitle className="max-w-5xl">Prompts are the new interface</SlideTitle>
        <SlideContent className="mx-auto max-w-4xl">
          As agents take action, the prompt is how we steer them — and the tooling that manages those prompts is what
          people now call the <SlideHighlight>&ldquo;harness&rdquo;</SlideHighlight>.
        </SlideContent>
        <p className="mx-auto mt-6 max-w-3xl text-lg font-medium text-muted-foreground/80 md:text-xl">
          The harness isn&apos;t the prompt — it&apos;s what keeps your prompts accurate and well-tuned. So let&apos;s
          keep it <SlideHighlight>open, shared, and improvable</SlideHighlight>.
        </p>
      </div>

      <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
        <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-none bg-primary/10 text-primary">
          <Rocket className="h-12 w-12" />
        </div>
        <SlideTitle>Thank you</SlideTitle>
        <SlideContent className="mx-auto max-w-4xl">
          Come build the open prompt ecosystem with us.
        </SlideContent>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <Pill>prompts.chat</Pill>
          <Pill>/book</Pill>
          <Pill>/kids</Pill>
          <Pill>github.com/f/prompts.chat</Pill>
        </div>
        <div className="mt-8 flex items-center gap-2 text-lg font-semibold text-muted-foreground">
          Questions <ArrowRight className="h-5 w-5" />
        </div>
      </div>
    </SlideDeck>
  );
}
