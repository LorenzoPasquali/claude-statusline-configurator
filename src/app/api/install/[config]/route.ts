import { NextRequest, NextResponse } from "next/server";
import { generateInstallerScript } from "@/lib/installer-generator";
import { GlobalConfig, ModuleConfig } from "@/types/config";

export async function GET(
  req: NextRequest,
  { params }: { params: { config: string } }
) {
  try {
    const jsonStr = Buffer.from(params.config, "base64url").toString("utf-8");
    const data = JSON.parse(jsonStr);

    const globalConfig: GlobalConfig = data.g;
    const modules: ModuleConfig[] = data.m;

    if (!globalConfig || !modules) {
      return new NextResponse("Invalid configuration", { status: 400 });
    }

    const script = generateInstallerScript(globalConfig, modules);

    return new NextResponse(script, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error(error);
    return new NextResponse("Failed to generate script: Invalid config encoding", { status: 400 });
  }
}
