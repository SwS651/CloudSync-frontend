import { type FC, useState } from "react";
import { useModal } from "@refinedev/core";
import { Button, FloatButton, Modal, Space, type ThemeConfig, theme } from "antd";
import { RefineThemes } from "@refinedev/antd";
import { BgColorsOutlined, ClearOutlined, CommentOutlined, FormatPainterFilled, MoonFilled, PlusCircleFilled, PlusOutlined, SunFilled } from "@ant-design/icons";

type ThemeName = keyof typeof RefineThemes;

interface Props {
  currentTheme: ThemeConfig;
  onThemeClick: (theme: ThemeConfig) => void;
}

export const ThemeSettings: FC<Props> = ({ currentTheme, onThemeClick }) => {
    const [mode, setMode] = useState<"dark" | "light">("light");
    const { show, close, visible } = useModal();

    const onTokenColorClick = (token: ThemeConfig["token"]) => {
      onThemeClick({
        ...currentTheme,
        token,
      });

      close();
    };

    const toggleMode = () => {
      onThemeClick({
        ...currentTheme,
        algorithm: mode === "dark" ? theme.defaultAlgorithm : theme.darkAlgorithm,
      });
      setMode((prev) => (prev === "dark" ? "light" : "dark"));

      close();
    };

    return (
      <>
        
        <Modal
          open={visible}
          onCancel={close}
          destroyOnClose
          title="Theme Settings"
          footer={null}
        >
          <Space direction="vertical" size="large">
            <Space
              style={{
                flexWrap: "wrap",
              }}
            >
              {Object.keys(RefineThemes).map((name) => {
                const theme = RefineThemes[name as ThemeName];

                return (
                  <Button
                    key={theme.token?.colorPrimary}
                    onClick={() => {
                      onTokenColorClick(theme.token);
                    }}
                    style={{
                      background: theme.token?.colorPrimary,
                    }}
                  >
                    {name}
                  </Button>
                );
              })}
            </Space>

            <Button type="dashed" onClick={toggleMode}>
              {/* Set Mode to {mode === "dark" ? "Light ☀️" : "Dark  🌑"} */}
              {mode === "dark" ? "🌑 Dark" : "☀️ Light"} Mode
            </Button>
          </Space>
        </Modal>

        <FloatButton.Group
            trigger="hover"
            type="primary"
            style={{ insetInlineEnd: 24 }}
            icon={<PlusOutlined/>}
            >
            <FloatButton icon={<BgColorsOutlined />}  onClick={show}/>
            <FloatButton icon={mode === "dark" ? <MoonFilled/> : <SunFilled/>} onClick={toggleMode}/>
        </FloatButton.Group>
      </>
    );
};

export default ThemeSettings;
