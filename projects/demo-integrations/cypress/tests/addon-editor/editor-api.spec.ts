import {
    tuiClearEditor,
    tuiFocusToStartInEditor,
    tuiGetContentEditable,
    tuiGetDemoContent,
    tuiGetEditLinkInput,
    tuiGetEditorScrollbarArea,
    tuiGetScreenshotArea,
    tuiInsertLink,
    tuiOpenAnchorDropdown,
    tuiOpenFontTool,
    tuiSelectTag,
    tuiVisitEditorApiPage,
} from '../../support/editor/helpers';
import {
    HTML_EDITOR_EXAMPLE_NESTED_UL,
    HTML_EDITOR_EXAMPLE_UL,
} from '../../support/editor/html';
import {
    PROSE_MIRROR_EDITOR_SELECTOR,
    WAIT_BEFORE_SCREENSHOT,
} from '../../support/shared.entities';

describe(`Editor API`, () => {
    describe(`Check fonts in light and dark mode`, () => {
        for (const [index, {enableNightMode}] of [
            {enableNightMode: true},
            {enableNightMode: false},
        ].entries()) {
            it(`check font in editor, enableNightMode is ${enableNightMode}`, () => {
                tuiVisitEditorApiPage({enableNightMode});
                tuiClearEditor();

                for (const [position, type] of [
                    `Small`,
                    `Normal`,
                    `Large`,
                    `Subtitle`,
                    `Title`,
                ].entries()) {
                    const screenshot = `${
                        index + 1
                    }-1-night-mode-enabled-${enableNightMode}-font-${position}-${type}`;

                    tuiOpenFontTool()
                        .findByAutomationId(`tui_font__${type.toLowerCase()}`)
                        .wait(WAIT_BEFORE_SCREENSHOT)
                        .click();

                    tuiGetContentEditable()
                        .type(`${type}{enter}`)
                        .wait(WAIT_BEFORE_SCREENSHOT);

                    tuiGetScreenshotArea().matchImageSnapshot(screenshot);
                }
            });
        }
    });

    describe(`Dark mode`, () => {
        beforeEach(() => tuiVisitEditorApiPage({enableNightMode: true}));

        it(`supports dark mode (input)`, () => {
            tuiGetDemoContent().find(`tui-editor`).as(`editor`);

            cy.get(`@editor`)
                .wait(WAIT_BEFORE_SCREENSHOT)
                .matchImageSnapshot(`1-1-dark-mode-input`);

            cy.get(`@editor`).find(`tui-scrollbar`).scrollTo(0, 500);
            cy.get(`@editor`)
                .wait(WAIT_BEFORE_SCREENSHOT)
                .matchImageSnapshot(`1-2-dark-mode-input`);
        });

        it(`supports dark mode (output)`, () => {
            tuiGetDemoContent()
                .find(`tui-editor-socket`)
                .wait(WAIT_BEFORE_SCREENSHOT)
                .matchImageSnapshot(`2-1-dark-mode-output`);
        });
    });

    describe(`ordered list / bullet list`, () => {
        it(`flat`, () => {
            tuiVisitEditorApiPage({content: HTML_EDITOR_EXAMPLE_UL});

            tuiGetDemoContent()
                .find(`tui-editor-socket`)
                .wait(WAIT_BEFORE_SCREENSHOT)
                .matchImageSnapshot(`4-1-bullet-and-ordered-list`);
        });

        it(`nested`, () => {
            tuiVisitEditorApiPage({content: HTML_EDITOR_EXAMPLE_NESTED_UL});

            tuiGetDemoContent()
                .find(`tui-editor-socket`)
                .wait(WAIT_BEFORE_SCREENSHOT)
                .matchImageSnapshot(`5-1-bullet-and-ordered-nested-list`);
        });

        it(`emulate user toggling`, () => {
            tuiVisitEditorApiPage({content: ``});
            tuiGetDemoContent().as(`wrapper`);

            cy.get(`@wrapper`).find(PROSE_MIRROR_EDITOR_SELECTOR).as(`editor`);

            toggleBullet(`tuiIconViewListLarge`);

            cy.get(`@editor`).type(`1{enter}`).type(`{enter}`);

            toggleBullet(`tuiIconOLLarge`);

            cy.get(`@editor`).type(`A`);
            cy.get(`@wrapper`)
                .wait(WAIT_BEFORE_SCREENSHOT)
                .matchImageSnapshot(`6-1-bullet-and-ordered-list`);

            clearEditor();
            toggleBullet(`tuiIconViewListLarge`);

            cy.get(`@editor`).type(
                `first line{shift+enter}second line{shift+enter}third line{shift+enter}{enter}first line`,
            );
            cy.get(`@wrapper`)
                .wait(WAIT_BEFORE_SCREENSHOT)
                .matchImageSnapshot(`6-2-bullet-and-ordered-list`);

            clearEditor();
            toggleBullet(`tuiIconOLLarge`);

            cy.get(`@editor`).type(
                `first line{shift+enter}second line{shift+enter}third line{shift+enter}{enter}first line`,
            );
            cy.get(`@wrapper`)
                .wait(WAIT_BEFORE_SCREENSHOT)
                .matchImageSnapshot(`6-3-bullet-and-ordered-list`);
        });

        it(`nested`, () => {
            tuiVisitEditorApiPage({content: ``});
            tuiGetDemoContent().as(`wrapper`);

            cy.get(`@wrapper`).find(PROSE_MIRROR_EDITOR_SELECTOR).as(`editor`);

            toggleBullet(`tuiIconViewListLarge`);
            cy.get(`@editor`).type(`1{enter}`);
            cy.get(`@editor`).type(`2`);
            toggleBullet(`tuiIconIndentLarge`);

            cy.get(`@wrapper`)
                .wait(WAIT_BEFORE_SCREENSHOT)
                .matchImageSnapshot(`7-1-nested-list`);

            cy.get(`@editor`).type(`{enter}`);
            cy.get(`@editor`).type(`3`);
            toggleBullet(`tuiIconIndentLarge`);

            cy.get(`@wrapper`)
                .wait(WAIT_BEFORE_SCREENSHOT)
                .matchImageSnapshot(`7-2-nested-list`);

            cy.get(`@editor`).type(`{enter}`);
            cy.get(`@editor`).type(`4`);
            toggleBullet(`tuiIconIndentLarge`);

            cy.get(`@wrapper`)
                .wait(WAIT_BEFORE_SCREENSHOT)
                .matchImageSnapshot(`7-3-nested-list`);

            cy.get(`@editor`).type(`{enter}`);
            toggleBullet(`tuiIconOutdentLarge`);

            cy.get(`@wrapper`)
                .wait(WAIT_BEFORE_SCREENSHOT)
                .matchImageSnapshot(`7-4-nested-list`);

            cy.get(`@editor`).type(`{enter}`);
            toggleBullet(`tuiIconOutdentLarge`);
            cy.get(`@editor`).type(`5`);

            cy.get(`@wrapper`).matchImageSnapshot(`7-6-nested-list`);
        });

        function toggleBullet(iconType: string): void {
            cy.get(`@wrapper`)
                .find(`button[icon="tuiIconViewListLarge"]`)
                .click({force: true});
            cy.get(`tui-dropdown`)
                .find(`button[icon="${iconType}"]`)
                .click({force: true});
        }

        function clearEditor(): void {
            cy.get(`@editor`).type(`{selectall}{backspace}`);
        }
    });

    describe(`Editor and Dropdown`, () => {
        beforeEach(() => tuiVisitEditorApiPage());

        it(`should not overlap tools`, () => {
            tuiFocusToStartInEditor();
            tuiSelectTag(tuiGetContentEditable().find(`strong`));
            tuiInsertLink();
            tuiGetEditLinkInput().type(`wysiwyg.com`);
            tuiGetEditLinkInput().type(`{enter}`);

            tuiFocusToStartInEditor(); // clear hints

            tuiOpenAnchorDropdown({containHref: `http://wysiwyg.com`});
            tuiGetEditorScrollbarArea().scrollTo(0, 100);
            tuiGetScreenshotArea().matchImageSnapshot(`8-1-added-new-link`);

            tuiGetEditorScrollbarArea().scrollTo(0, 0);
            tuiGetScreenshotArea().matchImageSnapshot(`8-2-added-new-link`);
        });
    });
});
